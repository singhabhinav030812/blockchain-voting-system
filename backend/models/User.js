let users = [];
let idCounter = 1;

class User {
  static async findOne(query) {
    if (query.$or) {
      return users.find(u => query.$or.some(q => (q.email && u.email === q.email) || (q.studentId && u.studentId === q.studentId)));
    }
    return users.find(u => Object.keys(query).every(k => u[k] === query[k]));
  }
  static async findById(id) {
    return users.find(u => String(u._id) === String(id));
  }
  static async create(data) {
    const newUser = { 
      _id: String(idCounter++), 
      ...data, 
      votedPositions: [], 
      save: async function() { Object.assign(users.find(u => u._id === this._id), this); } 
    };
    users.push(newUser);
    return newUser;
  }
}

module.exports = User;
