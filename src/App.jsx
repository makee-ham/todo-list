import { useEffect, useReducer, useState } from "react";
import Functions from "./components/Functions";
import { getRegExp } from "korean-regexp";
import useFetch from "./hooks/useFetch";
import axios from "axios";

const todoReducer = (state, action) => {
  switch (action.type) {
    case "SET_TODO":
      return action.payload;
    case "ADD_TODO":
      return [...state, action.payload]; // id는 서버가 id 자동 생성 및 추가
    case "EDIT_TODO":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text }
          : todo
      );
    case "REORDER_TODO":
      // 필터링되어서 보이는 것만 조작하더라도, 여기랑 핸들러에서 전체 todos 기준으로 업데이트 하기에 괜찮다
      return action.payload.map((todo, index) => ({ ...todo, order: index }));
    case "DONE_TODO":
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    default:
      return state;
  }
};

function App() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [newTodo, setNewTodo] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [draggingId, setDraggingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterButtonStatus, setFilterButtonStatus] = useState("all");

  // 최초 마운트 때 db 불러오기 (SET_TODO)
  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await axios.get("http://localhost:4000/todos"); // 여기서 JSON 객체 파싱까지 해줌
        dispatch({ type: "SET_TODO", payload: response.data });
      } catch (err) {
        console.error(`데이터를 불러오는 데 실패했습니다. ${err}`);
      }
    }

    fetchTodos();
  }, []);

  // 추가 관련
  const handleAddTodo = async (text) => {
    if (text.trim() === "") {
      alert("할 일 내용을 입력 후 추가해 주세요.");
      return;
    }

    try {
      const newTodo = { text, completed: false, order: todos.length };
      const response = await axios.post("http://localhost:4000/todos", newTodo); // todos 배열에 newTodo 객체 추가
      dispatch({ type: "ADD_TODO", payload: response.data });
    } catch (err) {
      console.error("항목 추가에 실패했습니다.", err);
    }
  };

  // 수정 관련
  const handleEditTodo = async (id, text) => {
    if (text.trim() === "") {
      alert("할 일 내용을 입력 후 수정해 주세요.");
      return;
    }

    try {
      await axios.post(`http://localhost:4000/todos/${id}`, { text }); // text: text 축약
      dispatch({ type: "EDIT_TODO", payload: { id, text } });
    } catch (err) {
      console.error("항목 수정에 실패했습니다.", err);
    }
  };

  const startEditMode = (id, text) => {
    setIsEdit(true);
    setEditId(id);
    setEditText(text);
  };

  const endEditMode = () => {
    setIsEdit(false);
    setEditId(null);
    setEditText("");
  };

  useEffect(() => {
    if (!isEdit) return;

    const escapeModalOff = (e) => {
      if (e.key === "Escape" && isEdit) endEditMode();
    };

    window.addEventListener("keydown", escapeModalOff);

    return () => window.removeEventListener("keydown", escapeModalOff);
  }, [isEdit]);

  // 드래그 관련
  const handleDragStart = (id) => {
    setDraggingId(id);
  };

  const handleDragOver = async (targetId, e) => {
    e.preventDefault();

    if (draggingId === null || draggingId === targetId) return;

    const newTodos = [...todos];
    const fromIndex = newTodos.findIndex((todo) => todo.id === draggingId);
    const toIndex = newTodos.findIndex((todo) => todo.id === targetId);
    const draggingItem = newTodos[fromIndex];

    newTodos.splice(fromIndex, 1);
    newTodos.splice(toIndex, 0, draggingItem);

    // order 값 재정렬
    const updatedTodos = newTodos.map((todo, index) => ({
      ...todo,
      order: index,
    }));

    // ^ 위에서 order값 재정렬한 걸 db에 반영!
    try {
      // Promise.all로 모든 todo.id마다 axios.patch() 보내기 -- 전체 목록 order 바뀐 것 비동기 업데이트
      await Promise.all(
        updatedTodos.map((todo) =>
          axios.patch(`http://localhost:4000/todos/${todo.id}`, {
            order: todo.order,
          })
        )
      );
      // todos 상태 갱신
      dispatch({ type: "REORDER_TODO", payload: updatedTodos });
      setDraggingId(targetId); // 드래그 중 마우스가 어떤 요소 위에 있는지를 추적
    } catch (err) {
      console.error("항목 순서 변경에 실패했습니다.", err);
    }
  };

  const handleDrop = () => setDraggingId(null);

  // 할 일 완료 여부 관련
  const handleDoneTodo = async (id) => {
    const targetTodo = todos.find((todo) => todo.id === id);
    if (!targetTodo) return;

    try {
      await axios.patch(`http://localhost:4000/todos/${id}`, {
        completed: !targetTodo.completed,
      });
      dispatch({ type: "DONE_TODO", payload: id });
    } catch (err) {
      console.error("항목 완료 상태 변경에 실패했습니다.", err);
    }
  };

  // 삭제 관련
  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/todos/${id}`);
      dispatch({ type: "DELETE_TODO", payload: id });
    } catch (err) {
      console.error("항목 삭제에 실패했습니다.", err);
    }
  };

  // 버튼+검색 필터
  const filterTodos = (todoList) => {
    return todoList
      .filter((todo) => {
        // 완료 여부 버튼 필터
        if (filterButtonStatus === "uncompleted") return !todo.completed;
        if (filterButtonStatus === "completed") return todo.completed;
        return true;
        // 투두 검색 필터
      })
      .filter((todo) => {
        const searchedValue = getRegExp(search);
        return todo.text.match(searchedValue);
      });
  };

  // 랜덤 명언
  const {
    data: quoteData,
    loading: quoteLoading,
    error: quoteError,
  } = useFetch("https://dummyjson.com/quotes/random");

  return (
    <>
      <div id="app-container">
        <header>
          <h1>Things Todo</h1>
        </header>
        <main>
          <Functions />
          <section id="todo-container">
            <div id="todo-filter-container">
              <div id="search-filter">
                <input
                  type="text"
                  placeholder="검색어를 입력해주세요"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div id="button-filter">
                <button onClick={() => setFilterButtonStatus("all")}>
                  모두 보기
                </button>
                <button onClick={() => setFilterButtonStatus("uncompleted")}>
                  미완료 항목
                </button>
                <button onClick={() => setFilterButtonStatus("completed")}>
                  완료한 항목
                </button>
              </div>
            </div>
            <ul id="todo-list">
              {filterTodos(todos).map((todo) => (
                <li
                  key={todo.id}
                  draggable={false}
                  onDragEnter={(e) => handleDragOver(todo.id, e)}
                  onDrop={{ handleDrop }}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleDoneTodo(todo.id)}
                  />
                  {todo.text}
                  <button onClick={() => startEditMode(todo.id, todo.text)}>
                    수정
                  </button>
                  <button onClick={() => handleDeleteTodo(todo.id)}>
                    삭제
                  </button>
                  <button
                    draggable
                    onDragStart={() => handleDragStart(todo.id)}
                  >
                    ⋮
                  </button>
                </li>
              ))}
            </ul>
            <form
              id="add-todo"
              onSubmit={(e) => {
                e.preventDefault(); // form 제출 기본 동작인 새로고침 방지
                handleAddTodo(newTodo);
                setNewTodo("");
              }}
            >
              <input
                type="text"
                placeholder="새로운 할 일을 입력하세요"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <button type="submit">추가</button>
            </form>
          </section>
        </main>
        <footer>
          {quoteError ? (
            <p>랜덤 명언을 가져오는 데 실패했습니다. : {quoteError}</p>
          ) : quoteLoading || !quoteData ? (
            <p>랜덤 명언을 불러오는 중입니다...</p>
          ) : (
            <p>
              "{quoteData.quote}"<span>— {quoteData.author}</span>
            </p>
          )}
        </footer>
      </div>
      {/* 수정 버튼 클릭 시 나타나는 모달 팝업 */}
      <div id="edit-modal" className={`${isEdit ? "block" : "hidden"}`}>
        <div id="modal-body">
          {/* 취소, 저장, esc 누를 때 닫히게 하자 */}
          <h1>일정 수정</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditTodo(editId, editText);
              endEditMode();
            }}
          >
            <input
              autoFocus
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            ></input>
            <button type="button" onClick={endEditMode}>
              취소
            </button>
            <button type="submit">수정</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
