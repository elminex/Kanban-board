document.addEventListener('DOMContentLoaded', () => {

    function randomString() {
        const chars = '0123456789abcdefghijklmnopqrstuwvxyzABCDEFGHIJKLMNOPQRSTUWVXYZ';
        let str = '';
        for (let i = 0; i < 10; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }
    function generateTemplate(name, data, basicElement) {
        const template = document.getElementById(name).innerHTML;
        const element = document.createElement(basicElement || 'div');
        Mustache.parse(template);
        element.innerHTML = Mustache.render(template, data);
        return element;
    }

    class Column {
        constructor(name) {
            this.id = randomString();
            this.name = name;
            this.element = generateTemplate('column-template', { name: this.name, id: this.id });
            this.element.querySelector('.column').addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-delete')) {
                    this.removeColumn();
                }
                if (e.target.classList.contains('add-card')) {
                    this.addCard(new Card((prompt('Enter the name of the card') || 'New Card')));
                }
            });
        }
        addCard(card) {
            this.element.querySelector('ul').appendChild(card.element);
        }
        removeColumn() {
            this.element.parentNode.removeChild(this.element);
        }
    }

    class Card {
        constructor(description) {
            this.id = randomString();
            this.description = description;
            this.element = generateTemplate('card-template', { description: this.description }, 'li');
            this.element.querySelector('.card').addEventListener('click', (e) => {
                e.stopPropagation();
                if (e.target.classList.contains('btn-delete')) {
                    this.removeCard();
                }
            });
        }
        removeCard() {
            this.element.parentNode.removeChild(this.element);
        }
    }

    class Board {
        constructor(name) {
            this.name = name;
            this.id = randomString();
            this.element = generateTemplate('board-template', { name: this.name, id: this.id });
            this.columnWrapper = this.element.querySelector('.column-container');
            this.element.querySelector('.create-column').addEventListener('click', () => {
                let name = (prompt('Enter a column name') || 'New column');
                let column = new Column(name);
                this.addColumn(column);
            });
        }
        addColumn(column) {
            this.columnWrapper.appendChild(column.element);
            initSortable(column.id);
        }
    }

    function initSortable(id) {
        const el = document.getElementById(id);
        let sortable = Sortable.create(el, {
            group: 'kanban',
            sort: true,
        });
        
    }

    document.querySelector('.create-board').addEventListener('click', () => {
        let name = (prompt('Enter board name') || 'New board');
        let board = new Board(name);
        document.querySelector('.board-wrapper').appendChild(board.element);
        unwrap(board.element);
    });

    let board1 = new Board('Nowa tablica');
    document.querySelector('.board-wrapper').appendChild(board1.element);
    unwrap(board1.element);


    let todoColumn = new Column('To do');
    let doingColumn = new Column('Doing');
    let doneColumn = new Column('Done');

    board1.addColumn(todoColumn);
    board1.addColumn(doingColumn);
    board1.addColumn(doneColumn);

    const card1 = new Card('New task');
    const card2 = new Card('Create kanban boards');

    todoColumn.addCard(card1);
    doingColumn.addCard(card2);

    function unwrap(node) {
        node.replaceWith(...node.childNodes);
    }
});

