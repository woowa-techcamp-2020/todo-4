import mysql from "mysql2";

const getInitialData = `select column.id colId, column.title columnTitle, columnOrder.order, card.id cardId,  card.note, card.writer
  from todo.card, todo.column, todo.columnOrder 
  where card.id = columnOrder.card_id and column.id = columnOrder.col_id
  order by column.id, columnOrder.order
  `;
const getAllColumn = `select * from todo.column;`;
const getAllCard = `select * from todo.card;`;
const getAllColumnOrder = "select * from todo.columnOrder";
// const putColumnOrderForDAD = function (params) {
//   let pushOrderQuery = `
//   update todo.columnOrder
//   set columnOrder.order = columnOrder.order + 1
//   where col_id = ? and columnOrder.order >= ?;
//   `;
//   let switchCardQuery = `
//   update todo.columnOrder
//   set columnOrder.order = ?, col_id = ?
//   where card_id = ?;
//   `;
//   let pullOrderQuery = `
//   update todo.columnOrder
//   set columnOrder.order = columnOrder.order - 1
//   where col_id = ? and columnOrder.order > ?;
//   `;
//   const pushOrderQueryC = mysql.format(pushOrderQuery, [
//     params.toColumnId,
//     params.orderInToColumn,
//   ]);
//   const switchCardQueryC = mysql.format(switchCardQuery, [
//     params.orderInToColumn,
//     params.toColumnId,
//     params.cardId,
//   ]);
//   const pullOrderQueryC = mysql.format(pullOrderQuery, [
//     params.fromColumnId,
//     params.orderInFromColumn,
//   ]);

//   return pushOrderQueryC + switchCardQueryC + pullOrderQueryC;
// };

const pushOrder = function (params) {
  let pushOrderQuery = `
  update todo.columnOrder
  set columnOrder.order = columnOrder.order + 1
  where col_id = ? and columnOrder.order >= ?;
  `;
  const pushOrderQueryC = mysql.format(pushOrderQuery, [
    params.toColumnId,
    params.orderInToColumn,
  ]);

  return pushOrderQueryC;
};
const switchCard = function (params) {
  let switchCardQuery = `
    update todo.columnOrder
    set columnOrder.order = ?, col_id = ?
    where card_id = ?;
    `;
  const switchCardQueryC = mysql.format(switchCardQuery, [
    params.orderInToColumn,
    params.toColumnId,
    params.cardId,
  ]);

  return switchCardQueryC;
};
const pullOrder = function (params) {
  let pullOrderQuery = `
    update todo.columnOrder
    set columnOrder.order = columnOrder.order - 1
    where col_id = ? and columnOrder.order > ?;
    `;
  const pullOrderQueryC = mysql.format(pullOrderQuery, [
    params.fromColumnId,
    params.orderInFromColumn,
  ]);

  return pullOrderQueryC;
};

const postCard = function (params) {
  let insertCardQuery = `
  insert into todo.card (note, writer ,activation)
  values (?, ?, ?);
  `;

  const insertCardQueryC = mysql.format(insertCardQuery, [
    params.note,
    params.writer,
    1,
  ]);
  return insertCardQueryC;
};

const postMoveActivity = function (params) {
  let insertActivityQuery = `
  INSERT into todo.activity (actionType , userName ,fromColumnTitle , toColumnTitle , cardNote )
  values ("move", "user1" , 
  (select title from todo.column where id = ?), 
  (select title from todo.column where id = ?),
  (select note from todo.card where id = ?));
  `;

  const insertActivityQueryC = mysql.format(insertActivityQuery, [
    params.fromColumnId,
    params.toColumnId,
    params.cardId,
  ]);
  return insertActivityQueryC;
};

const postDeleteActivity = function (params) {
  let insertActivityQuery = `
  INSERT into todo.activity (actionType , userName ,fromColumnTitle , toColumnTitle , cardNote )
  values ("delete", "user1" , 
  (select title from todo.column where id = ?), 
  (select title from todo.column where id = ?),
  (select note from todo.card where id = ?));
  `;

  const insertActivityQueryC = mysql.format(insertActivityQuery, [
    params.colId,
    params.colId,
    params.cardId,
  ]);
  return insertActivityQueryC;
};

const postAddActivity = function (params) {
  let insertActivityQuery = `
  INSERT into todo.activity (actionType , userName ,fromColumnTitle , toColumnTitle , cardNote )
  values ("add", "user1" , 
  (select title from todo.column where id = ?), 
  (select title from todo.column where id = ?),
  ?
  );
  `;

  const insertActivityQueryC = mysql.format(insertActivityQuery, [
    params.columnId,
    params.columnId,
    params.note,
  ]);
  return insertActivityQueryC;
};

const postUpdateActivity = function (params) {
  let insertActivityQuery = `
  INSERT into todo.activity (actionType , userName  , cardNote )
  values ("update", "user1", ?);
  `;

  const insertActivityQueryC = mysql.format(insertActivityQuery, [params.note]);
  return insertActivityQueryC;
};

const pushColumnOrder = function (columnId, order) {
  let pushOrderQuery = `
  update todo.columnOrder
  set columnOrder.order = columnOrder.order + 1
  where col_id = ? and columnOrder.order >= ?;
  `;
  const pushOrderQueryC = mysql.format(pushOrderQuery, [columnId, order]);
  return pushOrderQueryC;
};

const pullColumnOrder = function (columnId, order) {
  let pullOrderQuery = `
  update todo.columnOrder
  set columnOrder.order = columnOrder.order - 1
  where col_id = ? and columnOrder.order > ?;
  `;
  const pullOrderQueryC = mysql.format(pullOrderQuery, [columnId, order]);
  return pullOrderQueryC;
};

const postColumnOrder = function (columnId, cardId, order) {
  let insertColumnOrderQuery = `
  insert into todo.columnOrder (columnOrder.order, col_id, card_id)
  values (?, ?, ?);
  `;
  const insertColumnOrderQueryC = mysql.format(insertColumnOrderQuery, [
    order,
    columnId,
    cardId,
  ]);
  return insertColumnOrderQueryC;
};

const putCard = function (params) {
  let putCardQuery = `
  update todo.card
  set card.note = ?
  where id = ?;
  `;
  const putCardQueryC = mysql.format(putCardQuery, [
    params.note,
    params.cardId,
  ]);
  return putCardQueryC;
};

const deleteCard = function (params) {
  let deleteCardQuery = `
  delete from todo.card
  where id = ?;
  `;
  const deleteCardQueryC = mysql.format(deleteCardQuery, [params.cardId]);
  return deleteCardQueryC;
};

const putColumn = function (params) {
  let putColumnQuery = `
  update todo.column
  set column.title = ?
  where id = ?;
  `;
  const putColumnQueryC = mysql.format(putColumnQuery, [
    params.title,
    params.columnId,
  ]);
  return putColumnQueryC;
};

const getAllActivity = `select * from todo.activity order by actionTime desc;`;

const postActivity = function (params) {
  let postActivityQuery = `
  insert into todo.activity (actionType, userName, fromColumnTitle, toColumnTitle, cardNote)
  values (?, ?, ?, ?, ?);
  `;
  const postActivityQueryC = mysql.format(postActivityQuery, [
    params.actionType,
    params.userName,
    params.fromColumnTitle,
    params.toColumnTitle,
    params.cardNote,
  ]);
  return postActivityQueryC;
};

export {
  getInitialData,
  getAllCard,
  getAllColumn,
  getAllColumnOrder,
  // putColumnOrderForDAD,
  postCard,
  pushColumnOrder,
  postColumnOrder,
  putCard,
  deleteCard,
  pullColumnOrder,
  putColumn,
  getAllActivity,
  postActivity,
  postMoveActivity,
  postDeleteActivity,
  postAddActivity,
  postUpdateActivity,
  pushOrder,
  switchCard,
  pullOrder,
};
