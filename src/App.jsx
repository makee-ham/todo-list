import { useEffect, useReducer, useState } from "react";
import Functions from "./components/Functions";

const todoReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        { id: Date.now(), text: action.payload, completed: false },
      ];
    case "EDIT_TODO":
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text }
          : todo
      );
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
  const [filterButtonStatus, setFilterButtonStatus] = useState("all");

  // 추가 관련
  const addTodo = (text) => {
    if (text.trim() === "") {
      alert("할 일 내용을 입력 후 추가해 주세요.");
      return;
    }
    dispatch({ type: "ADD_TODO", payload: text });
  };

  // 수정 관련
  const editTodo = (id, text) => {
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

  // 할 일 완료 여부 관련
  const doneTodo = (id) => {
    dispatch({ type: "DONE_TODO", payload: id });
  };

  // 삭제 관련
  const deleteTodo = (id) => {
    dispatch({ type: "DELETE_TODO", payload: id });
  };

  // 완료 여부에 따른 필터된 투두
  const filteredTodos = todos.filter((todo) => {
    if (filterButtonStatus === "uncompleted") return !todo.completed;
    if (filterButtonStatus === "completed") return todo.completed;
    return true;
  });

  return (
    <>
      <div id="app-container">
        <header>
          <h1>Things Todo</h1>
        </header>
        <main>
          <Functions />
          <section id="todo-container">
            <div id="todo-filter">
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
            <ul id="todo-list">
              {filteredTodos.map((todo) => (
                <li key={todo.id}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => doneTodo(todo.id)}
                  />
                  {todo.text}
                  <button onClick={() => startEditMode(todo.id, todo.text)}>
                    수정
                  </button>
                  <button onClick={() => deleteTodo(todo.id)}>삭제</button>
                </li>
              ))}
            </ul>
            <form
              id="add-todo"
              onSubmit={(e) => {
                e.preventDefault(); // form 제출 기본 동작인 새로고침 방지
                addTodo(newTodo);
                setNewTodo("");
              }}
            >
              <input
                type="text"
                placeholder="새로운 할 일을 입력하세요."
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
              editTodo(editId, editText);
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
