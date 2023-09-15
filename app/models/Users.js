const { fetch, fetchOne } = require('../Library/postgres');

const usersSql = `
    select * from users limit $1 offset ($2 - 1) * $1;
`;

const createUserSql = `
insert into users ( user_name, user_password ) values ($1, $2) returning *
`;


const deleteUserSql = `
    delete from users where user_id = $1 returning *
`;

const users = async ({ p: page = null, l: limit = null }) => {
  return await fetch(usersSql, limit, page);
};

const createUser = async ({ user_name, user_password }) => {
  return await fetchOne(createUserSql, user_name, user_password);
};


const updateUser = async ({ user_id, column, value }) => {
  return await fetchOne(
    `update users set ${column} = $2 where user_id = $1 returning *`,
    user_id,
    value
  );
};

const deleteUser = async ({ user_id }) => {
  return await fetchOne(deleteUserSql, user_id);
};

module.exports.users = users;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
