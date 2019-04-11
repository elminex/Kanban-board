'use strict';
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
            //    let self = this;
            this.id = randomString();
            this.name = name;
            this.element = generateTemplate('column-template', { name: this.name, id: this.id });
            this.element.querySelector('.column').addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-delete')) {
                    this.removeColumn();
                }
                if (e.target.classList.contains('add-card')) {
                    this.addCard(new Card(prompt('Enter the name of the card')));
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

    const board = {
        name: 'Kanban Board',
        addColumn: function (column) {
            this.element.appendChild(column.element);
            initSortable(column.id);
        },
        element: document.querySelector('#board .column-container'),
    }

    function initSortable(id) {
        const el = document.getElementById(id);
        let sortable = Sortable.create(el, {
            group: 'kanban',
            sort: true
        });
    }
    document.querySelector('#board .create-column').addEventListener('click', () => {
        let name = prompt('Enter a column name');
        let column = new Column(name);
        board.addColumn(column);
    });

    // CREATING COLUMNS
    let todoColumn = new Column('To do');
    let doingColumn = new Column('Doing');
    let doneColumn = new Column('Done');

    // ADDING COLUMNS TO THE BOARD
    board.addColumn(todoColumn);
    board.addColumn(doingColumn);
    board.addColumn(doneColumn);

    // CREATING CARDS
    const card1 = new Card('New task');
    const card2 = new Card('Create kanban boards');

    // ADDING CARDS TO COLUMNS
    todoColumn.addCard(card1);
    doingColumn.addCard(card2);
});