/*
APIにアクセスするコンポーネント

今回実装すること
・立ち上がった直後にTaskモデルから一覧を取得
・idからタスクを取得して表示

*/
import React, { useState, useEffect } from 'react'

import axios from 'axios'

const DrfApiFetch = () => {

    // 全てのタスクを格納するステート
    const [tasks, setTasks] = useState([])

    // idから取得したタスクを格納するステート
    const [selectedTask, setSelectedTask] = useState([])

    // idを格納しておくステート
    const [id, setId] = useState([1])

    // フォームからTaskを登録するためのステート(idとtitleの初期値は空)
    const [editedTask, setEditedTask] = useState({id:'', title:''})

    // 立ち上がった時の処理
    useEffect( () => {
        // 第二引数にトークンを渡しているのは認証が必要なため
        axios.get('http://127.0.0.1:8000/api/tasks/', {
            headers: {
                'Authorization': 'Token c045863f6b8f3495bbe2099bb13f41924371b165'
            }
        })
        // 状態を取得して保持するres関数を定義
        .then(res => {setTasks(res.data)})

    // 初回のみ実行して欲しいので第二引数は空
    }, [])


    // idからTaskを取得
    const getTask = () => {
        console.log('getTask が読み込まれています');
        axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`, {
            headers: {
                'Authorization': 'Token c045863f6b8f3495bbe2099bb13f41924371b165'
            }})
        // データの取得に成功したらsetSelectedTaskにタスク(res.data)を格納する
        .then(res => {setSelectedTask(res.data)})
    }


    // Taskを作成
    const newTask = (task) => {
        const data = {
            title: task.title
        }
        // axiosを使ってデータを渡す場合、渡したいデータを第二引数に登録する
        axios.post('http://127.0.0.1:8000/api/tasks/', data,{
            headers: {
                // axiosを使ってデータを渡す場合Content-Type必須
                'Content-Type': 'application/json',
                'Authorization': 'Token c045863f6b8f3495bbe2099bb13f41924371b165'
            }})
        // 新規作成の処理が終わった後はsetTasks(今表示しているタスク)に追加する
        .then(res => {setTasks([...tasks, res.data]);
              // inputフォームを初期化している
              setEditedTask({id: '', title: ''})
    })
    }


    // Taskを編集
    const editTask = (task) => {
        console.log('editTask が呼ばれました')
        // axios.put 編集
        // 編集はidが必要なので変数を受け取る
        axios.put(`http://127.0.0.1:8000/api/tasks/${task.id}/`, task,{
            headers: {
                // axiosを使ってデータを渡す場合Content-Type必須
                'Content-Type': 'application/json',
                'Authorization': 'Token c045863f6b8f3495bbe2099bb13f41924371b165'
            }})
        // 今変更したタスクを特定して、書き換えて、表示させる処理
        .then(res => {setTasks(
                // tasksのidとeditedTaskのidが一緒だったら更新後のデータを取得して書き換える。そうでなければ既存のデータを上書きする。
                tasks.map(task => (task.id === editedTask.id ? res.data : task)));
                // editedTask(入力フォーム)を初期化する
                setEditedTask({id: '', title: ''})
        })
    }


    // idからTaskを削除(削除が終わったら消したタスクだけ表示させない処理)
    const deleteTask = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`, {
            headers: {
                'Authorization': 'Token c045863f6b8f3495bbe2099bb13f41924371b165'
            }})
        .then(res => {
            // データの削除に成功したら消したもの以外を表示させる
            setTasks(tasks.filter((task) => task.id !== id));
            // 選ばれていたタスク(検索から取り出している値)の初期化
            setSelectedTask([]);
            if (editedTask.id === id) {
                setEditedTask({id: '', title: ''});
            }
        });
    }


    // 入力フォームに変化がある度にeditedTaskに内容を保存する
    const handleInputChange = () => evn => {
        // input内のvalueの値を取得
        const value = evn.target.value;

        // titleを取得
        const name = evn.target.name;

        // 入力フォームに変更がある度にtitleだけ値を変更
        setEditedTask({...editedTask, [name]: value})
    }


    return (
        <div>
            <ul>
                {
                    tasks.map(task => <li key={task.id}>{task.title}
                            <button onClick={() => deleteTask(task.id)}>
                                <i className='fas fa-trash-alt'></i>
                            </button>

                            <button onClick={() => setEditedTask(task)}>
                                <i className='fas fa-pen'></i>
                            </button>
                        </li>)
                }
            </ul>

            Set id<br />
            <input type='text' value={id} onChange={evn => {setId(evn.target.value)}} />
            <br />
            <button type='button' onClick={() => getTask()}>Get Task</button>
            {/* <button type='button' onClick={() => deleteTask()}>Delete Task</button> */}
            <h3>Task ID {selectedTask.id} : {selectedTask.title}</h3>

            {/* required  入力必須 */}
            <input type='type' name='title'
            value={ editedTask.title }
            onChange={handleInputChange()}
            placeholder='New Task ?' required/>

            {/* id が存在する場合とそうでない場合 */}
            { editedTask.id ?
                <button onClick={()=>editTask(editedTask)}>Update</button> :
                <button onClick={()=>newTask(editedTask)}>Create</button>
            }
        </div>
    )
}

export default DrfApiFetch
