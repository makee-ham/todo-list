import { useEffect, useReducer, useState } from "react";
import Functions from "./components/Functions";
import { getRegExp } from "korean-regexp";

const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        {
          id: Date.now(),
          index: state.length,
          text: action.payload,
          completed: false,
        },
      ];
    case "EDIT_TODO":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text }
          : todo
      );
    case "REORDER_TODO":
      // 보이는 대로 todos 순서 변경 + index 값도 객체 내 저장
      return action.payload.map((todo, index) => ({ ...todo, index: index }));
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
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [filterButtonStatus, setFilterButtonStatus] = useState("all");

  // 추가 관련
  const handleAddTodo = (text) => {
    if (text.trim() === "") {
      alert("할 일 내용을 입력 후 추가해 주세요.");
      return;
    }
    dispatch({ type: "ADD_TODO", payload: text });
  };

  // 수정 관련
  const handleEditTodo = (id, text) => {
    if (text.trim() === "") {
      alert("할 일 내용을 입력 후 수정해 주세요.");
      return;
    }
    dispatch({ type: "EDIT_TODO", payload: { id: id, text: text } });
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
  const handleDragStart = (index) => setDraggingIndex(index);

  const handleDragOver = (index, e) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return; // index 제자리 거르기

    const newTodos = [...todos];
    const draggingItem = newTodos[draggingIndex];

    newTodos.splice(draggingIndex, 1);
    newTodos.splice(index, 0, draggingItem);

    dispatch({ type: "REORDER_TODO", payload: newTodos });
    setDraggingIndex(index);
  };

  const handleDrop = () => setDraggingIndex(null);

  // 할 일 완료 여부 관련
  const handleDoneTodo = (id) => {
    dispatch({ type: "DONE_TODO", payload: id });
  };

  // 삭제 관련
  const handleDeleteTodo = (id) => {
    dispatch({ type: "DELETE_TODO", payload: id });
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
              {filterTodos(todos).map((todo, index) => (
                <li
                  key={todo.id}
                  draggable={false}
                  onDragEnter={(e) => handleDragOver(index, e)}
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
                  <button draggable onDragStart={() => handleDragStart(index)}>
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
        <footer>{/* for random quotes */}</footer>
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
