// Do not use live server not to reload the page after adding a new monster!!! Just open the index.html file with the browser.

let page = 1 // current page default setting
let totalPages = 0 // total page default setting
const url = "http://localhost:3000/monsters" // server main url

const postMonster = function() {
  // set event listener to form on submit (this === form)
  this.addEventListener('submit', (e) => {
    e.preventDefault()
    console.dir(this[0].value)
    console.dir(Number.parseInt(this[1].value))
    console.dir(this[2].value)

    // post submit info to database
    fetch(`${url}?_sort=id&_order=desc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: this[0].value,
        age: Number.parseInt(this[1].value),
        description: this[2].value
      })
    }).then(res => res.json())
    .then(data => {
      console.log(data)
      this.reset()
      newPage()
    })
    .catch(e => console.log("Error:", e))
  })
}

const createForm = () => {
  const createMonster = document.querySelector("#create-monster")
  
  // create form tag
  const form = document.createElement("form")

  // create div tags
  const containerDiv = document.createElement("div")
  containerDiv.className = "container"
  const nameDiv = document.createElement("div")
  nameDiv.className = "form-control"
  const ageDiv = document.createElement("div")
  ageDiv.className = "form-control"
  const descriptionDiv = document.createElement("div")
  descriptionDiv.className = "form-control"

  // create input & placeholer for name
  const name = document.createElement("input")
  name.id = "name"
  name.placeholder = "New Monster Name"

  // create input & placeholer for age
  const age = document.createElement("input")
  age.id = "age"
  age.placeholder = "Age?"

  // create input & placeholer for description
  const description = document.createElement("input")
  description.id = "description"
  description.placeholder = "Short Description"

  // create submit button
  const submit = document.createElement("button")
  submit.className = "btn"
  submit.innerHTML = "Submit"
  
  // append the elements to main display
  nameDiv.append(name)
  ageDiv.append(age)
  descriptionDiv.append(description)
  form.append(nameDiv, ageDiv, descriptionDiv, submit)
  containerDiv.append(form)
  createMonster.append(containerDiv)

  // add current page number
  const pageNum = document.querySelectorAll(".pageNum")
  pageNum.forEach(el => el.innerHTML = page)

  // post info to database
  postMonster.call(form)
}

const makeMosterCards = (monsters) => {
  const monsterContainer = document.querySelector("#monster-container")

  monsters.forEach((monster, i) => {
    // get monster info
    const name = monster.name
    const age = Number.parseInt(monster.age)
    const description = monster.description
    const id = monster.id

    // create card
    const card = document.createElement("div")
    card.className = "card"
    if(i === 0) card.classList.add("active")
    card.innerHTML = `<h2 class="monster-name">${name} <span class="monster-age">[ ${age} yrs old (ID#${id}) ]</span></h2><br><p class="monster-description"><span style="color: beige; font-weight: bold;">BIO :</span> ${description}</p>`
    
    // prepare button to show description
    let btn = document.createElement("button")
    btn.className = "bio-toggle"
    btn.innerHTML = `<span class="card-open">v</span><span class="card-close">x</span>`
    btn.addEventListener("click", function(e) {
      card.classList.toggle("active")
    })
    card.append(btn)

    // show in the main display (#monster-container)
    monsterContainer.append(card)
    // return monsterContainer
  })
}

const getMonsters = function() {
  const monstersPerPage = 20
  fetch(`${url}?_sort=id&_order=desc&_page=${page}&_limit=${monstersPerPage}`)
  .then(res => res.json())
  .then(monsters => {
    console.log("Fetched Monsters =>", monsters)
    async function totalMonsters(url) {
      const totalNum = await fetch(url).then(res => res.json()).then(total => total.length)
      totalPages = Math.ceil(totalNum / monstersPerPage)
      makeMosterCards(monsters)
    }
    totalMonsters(url)
  })
}

const newPage = () => {
  document.querySelector("#monster-container").innerHTML = ""
  document.querySelectorAll(".pageNum").forEach(el => {
    el.innerHTML = page
  })
  getMonsters()
}

const navigatePages = () => {
  const previous = document.querySelectorAll(".previous")
  const next = document.querySelectorAll(".next")

  previous.forEach( prev => {
    prev.addEventListener('click', function(e) {
      if(page !== 1) {
        page--
        newPage()
      }
    })
  })

  next.forEach( nx => {
    nx.addEventListener('click', function(e) {
      if(page !== totalPages) {
        page++
        newPage()
      }
    })
  })
}

const init = () => {
  createForm()
  getMonsters()
  navigatePages()
}

init()