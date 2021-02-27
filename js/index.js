const USER = {"id": 1, "username": "pouros"};
const ul = document.querySelector('#list');
const show = document.querySelector('#show-panel');

document.addEventListener("DOMContentLoaded", () => {
    getBooks();

});

const getBooks = () => {
    axios.get('http://localhost:3000/books')
        .then(res => {
            for (let book of res.data) createBookLi(book)
        })
        .catch(err => console.log(err));
}

const getBookInfo = book => {
    axios.get(`http://localhost:3000/books/${book.id}`)
        .then(res => showBook(res.data))
        .catch(err => console.log(err));
}

const liked = (users, id) => {
    for (let user of users) {
        if (user.id === id) return true;
    }
    return false;
}

const updateLike = book => {
    const btn = document.getElementById(book.id)
    if (!liked(book.users, USER.id)) {
        book.users.push(USER)
        btn.innerText = "Unlike";
        axios.patch(`http://localhost:3000/books/${book.id}`, book)
            .then(res => {
                const users = btn.previousElementSibling;
                const self = createUserLi(USER);
                self.classList.add('self')
                users.appendChild(self);
            })
            .catch(err => console.log(err));
    } else {
        const me = book.users.find((user) => user.id === USER.id);
        book.users.splice(book.users.indexOf(me), 1);
        btn.innerText = "Like";
        axios.patch(`http://localhost:3000/books/${book.id}`, book)
            .then(res => {
                const users = btn.previousElementSibling;
                const self = users.querySelector('li.self');
                self.remove();
            })
            .catch(err => console.log(err));
    }
}

const createBookLi = book => {
    const li = document.createElement('li');
    li.innerText = book.title;

    li.addEventListener('click', () => getBookInfo(book));
    ul.appendChild(li);
}

const showBook = book => {  
    deleteShow(show);
    const img = document.createElement('img');
    const title = document.createElement('h2');
    const subtitle = document.createElement('h3');
    const author = document.createElement('h3');
    const p = document.createElement('p');
    const users = document.createElement('ul');
    const btn = document.createElement('button');

    img.src = book.img_url;
    title.innerText = book.title;
    subtitle.innerText = book.subtitle;
    author.innerText = book.author;
    p.innerText = book.description;
    btn.innerText = "Like";
    btn.id = book.id

    for (let user of book.users) {
        const li = createUserLi(user);
        users.appendChild(li);
    }

    btn.addEventListener('click', () => updateLike(book))

    show.append(img, title, subtitle, author, p, users, btn);
}

const createUserLi = user => {
    const li = document.createElement('li');
    li.innerText = user.username;
    return li;
}

const deleteShow = show => {
    while (show.firstChild) {
        show.firstChild.remove();
    }
}
