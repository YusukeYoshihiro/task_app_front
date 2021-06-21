import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { READ_TASK, POST_TASK, TASK_STATE, USER, CATEGORY } from "../types";

// タスクの一覧を取得
export const fetchAsyncGetTasks = createAsyncThunk("task/getTask", async () => {
  const res = await axios.get<READ_TASK[]>(
    `${process.env.REACT_APP_API_URL}/api/tasks/`,
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  );
  return res.data;
});

//　ユーザーの一覧を取得
export const fetchAsyncGetUsers = createAsyncThunk(
  "task/getUsers",
  async () => {
    const res = await axios.get<USER[]>(
      `${process.env.REACT_APP_API_URL}/api/users/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// categoryの一覧の取得
export const fetchAsyncGetCategory = createAsyncThunk(
  "task/getCategory",
  async () => {
    const res = await axios.get<CATEGORY[]>(
      `${process.env.REACT_APP_API_URL}/api/category/`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// category新規でを作成する非同期関数
export const fetchAsyncCreateCategory = createAsyncThunk(
  "task/createCategory",
  async (item: string) => {
    const res = await axios.post<CATEGORY>(
      `${process.env.REACT_APP_API_URL}/api/category/`,
      { item: item },
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// タスクを新規でを作成する非同期関数
export const fetchAsyncCreateTask = createAsyncThunk(
  "task/createTask",
  async (task: POST_TASK) => {
    const res = await axios.post<READ_TASK>(
      `${process.env.REACT_APP_API_URL}/api/tasks/`,
      { task:task },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// タスクを更新するための非同期関数
export const fetchAsyncUpdateTask = createAsyncThunk(
  "task/updateTask",
  async (task: POST_TASK) => {
    const res = await axios.put<READ_TASK>(
      `${process.env.REACT_APP_API_URL}/api/tasks/${task.id}/`,
      { task:task },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

// タスクを更新するための非同期関数
export const fetchAsyncDeleteTask = createAsyncThunk(
  "task/deleteTask",
  async (id: number) => {
    await axios.delete(
      `${process.env.REACT_APP_API_URL}/api/tasks/${id}/`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return id;
  }
);

export const initialState: TASK_STATE = {
  tasks: [
    {
      id: 0,
      task: "",
      description: "",
      criteria: "",
      status: "",
      status_name: "",
      category: 0,
      category_item: "",
      estimate: 0,
      responsible: 0,
      responsible_username: "",
      owner: 0,
      owner_username: "",
      created_at: "",
      updated_at: "",
    },
  ],
  editedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    status: "",
    category: 0,
    estimate: 0,
    responsible: 0,
  },
  selectedTask: {
    id: 0,
    task: "",
    description: "",
    criteria: "",
    status: "",
    status_name: "",
    category: 0,
    category_item: "",
    estimate: 0,
    responsible: 0,
    responsible_username: "",
    owner: 0,
    owner_username: "",
    created_at: "",
    updated_at: "",
  },
  users: [
    {
      id: 0,
      username: "",
    },
  ],
  category: [
    {
      id: 0,
      item: "",
    },
  ],
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    editTask(state, action: PayloadAction<POST_TASK>) {
      state.editedTask = action.payload;
    },
    selectTask(state, action: PayloadAction<READ_TASK>) {
      state.selectedTask = action.payload;
    },
  },
  // タスクの一覧を｀Get Method｀で取得し、成功した場合の処理
  extraReducers:(builder)=>{
    builder.addCase(
      fetchAsyncGetTasks.fulfilled,
      (state, action: PayloadAction<READ_TASK[]>)=>{
       return{
         ...state,
         tasks: action.payload,
       }
      }
    );
    // JWTのトークン認証のアクセスタイム（３０分）が経過した場合、再度ログインを促す。
    builder.addCase(fetchAsyncGetTasks.rejected, ()=> {
      window.location.href = '/';
    });
    // ユーザの一覧を｀Get Method｀で取得し、成功した場合の処理
    builder.addCase(
        fetchAsyncGetUsers.fulfilled,
        (state, action: PayloadAction<USER[]>)=>{
         return{
           ...state,
           users: action.payload,
         }
      }
    );
    // カテゴリーの一覧を｀Get Method｀で取得し、成功した場合の処理
    builder.addCase(
      fetchAsyncGetCategory.fulfilled,
      (state, action: PayloadAction<CATEGORY[]>)=>{
       return{
         ...state,
         category: action.payload,
       }
      }
    );
     // カテゴリーを`Create Method｀新規作成した場合の処理
    builder.addCase(
      fetchAsyncCreateCategory.fulfilled,
      (state, action: PayloadAction<CATEGORY>)=>{
       return{
         ...state,
         category: [...state.category, action.payload],
       }
      }
    );
    // JWTのトークン認証のアクセスタイム（３０分）が経過した場合、再度ログインを促す。
    builder.addCase(fetchAsyncCreateCategory.rejected, ()=> {
      window.location.href = '/';
    });
    // タスクを`Create Method｀新規作成した場合の処理
    builder.addCase(
      fetchAsyncCreateTask.fulfilled,
      (state, action: PayloadAction<READ_TASK>)=>{
        return{
          ...state,
          // 新規のタスクを先頭に持ってきたいため、 [action.payload, ...state.tasks]
          tasks: [action.payload, ...state.tasks,],
          editedTask: initialState.editedTask,
        }
      }
    );
    builder.addCase(fetchAsyncCreateTask.rejected, ()=> {
      window.location.href = '/';
    });
    // タスクを`Put Method｀更新,変更した場合の処理
    builder.addCase(
      fetchAsyncUpdateTask.fulfilled,
      (state, action: PayloadAction<READ_TASK>)=>{
        return{
          ...state,
          tasks: state.tasks.map((task)=>
            task.id === action.payload.id ? action.payload: task
          ),
          editedTask: initialState.editedTask,
          selectedTask: initialState.selectedTask,
        }
      }
    );
    builder.addCase(fetchAsyncUpdateTask.rejected, ()=> {
      window.location.href = '/';
    });
     // タスクを`Delete Method｀削除した場合の処理
     builder.addCase(
      fetchAsyncDeleteTask.fulfilled,
      (state, action: PayloadAction<number>)=>{
        return{
          ...state,
          // ｀filter｀を使って、削除したいもの以外のタスクを残す。
          tasks: state.tasks.filter((task)=> task.id !== action.payload),
          editedTask: initialState.editedTask,
          selectedTask: initialState.selectedTask,
        }
      }
    );
    builder.addCase(fetchAsyncDeleteTask.rejected, ()=> {
      window.location.href = '/';
    });

}
});

export const { editTask, selectTask } = taskSlice.actions;
export const selectSelectedTask = (state: RootState) => state.task.selectedTask;
export const selectEditedTask = (state: RootState) => state.task.editedTask;
export const selectTasks = (state: RootState) => state.task.tasks;
export const selectUsers = (state: RootState) => state.task.users;
export const selectCategory = (state: RootState) => state.task.category;
export default taskSlice.reducer;
