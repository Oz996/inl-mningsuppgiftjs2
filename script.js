const todoList = []
const display = document.querySelector("#displayTodos")
const modal = document.querySelector(".modal")
const addButton = document.querySelector('#todoButton')
const form = document.querySelector("#todoForm")



// Skapar en funktion som hämtar från databasen samt en forEach som lägger in alla 
// todos i todoList arrayen.

const fetchTodos = () => fetch("https://jsonplaceholder.typicode.com/todos/?_limit=7")
  .then(res=>res.json())
  .then(data=> {
    data.forEach((todo)=>{
      todoList.push(todo)
      showTodos()
    })
  })
fetchTodos()

// Lägger ut todos under display diven

const showTodos = () => {
  display.innerHTML = ""
  todoList.forEach((todo) => {
    display.appendChild(createTodo(todo))
  })
}

// Skapar en div som visar todons completed status, en paragraf med titeln och knappen 
// som ska ta bort todon samt en if-sats som låter oss ta bort todon ifall den är markerad

const createTodo = (todoData) => {
  const todo = document.createElement("div")
  todo.className = todoData.completed ?"todo completed":"todo"

  const title = document.createElement("p")
  title.textContent = todoData.title

  const deleteButton = document.createElement("button")
  deleteButton.textContent = "Remove"
  deleteButton.className = "btn btn-warning btn-outline-dark"

  deleteButton.addEventListener("click", () => {
    if (todoData.completed) {
      deleteTodo(todoData.id)
    } else {
      showModal()
    }
  })

  // Skapar checkrutan samt bootstrap class och checkrutan markerad räknas
  // som completed

  const checkBox = document.createElement("input")
  checkBox.setAttribute("type","checkbox")
  checkBox.className = "form-check-input"
  checkBox.id = "flexRadioDefault1"
  if (todoData.completed) {
    checkBox.checked = true
  }

  // Event listener som ändrar class till completed när en checkruta markeras
  checkBox.addEventListener("change", () => {
    const index = todoList.findIndex((element) => element.id == todoData.id)
    todoList[index].completed = !todoList[index].completed
    showTodos()
  })

  // Lägger till knappen, titeln och checkrutan till todos samt diven

  const div = document.createElement("div")
  div.append(checkBox, deleteButton)
  todo.append(title, div)
  return todo
}
 // fetch delete metod som tar bort todon från databasen

const deleteTodo = (todoId) => {
  fetch("https://jsonplaceholder.typicode.com/todos/" + todoId,
  {method: "DELETE"})
    .then((res) => console.log(res))
    .catch((err) => console.log(err))

  const index = todoList.findIndex((element) => element.id == todoId)
  todoList.splice(index, 1)
  showTodos()
}


// Lägger till skapad todo genom en fetch POST metod

const addTodo = (value) => {
  fetch("https://jsonplaceholder.typicode.com/todos/", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      title: value,
      completed: false,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      const newTodo = { ...data, id: crypto.randomUUID() }
      todoList.unshift(newTodo)
      showTodos()
    })
}
// Funktion som tar fram modalen(felmeddelandet) genom att lägga till en 
// active class

const showModal = () => {
  document.querySelector(".modal").classList.add("active")
}


// En event listener som tar bort active classen genom att klicka på 
// back knappen i modalen

modal.addEventListener("click", (e) => {
  if (e.target == document.querySelector("#closeModal")) {
    modal.classList.remove("active")
  }
})


// Alert som körs ifall inputen är tom, annars så läggs en ny todo till
  
  form.addEventListener("submit", (e) => {
  e.preventDefault()

  const value = form[0].value.trim()

  if (value == "") {
    alert('Input cant be empty')
    return
  } else {
    addTodo(value)
    form.reset()
  }
})
