let positions = [
  { _id: '101', title: 'Student Council President', description: 'Overall leader of the student body.' },
  { _id: '102', title: 'Vice President', description: 'Assists the president and leads sub-committees.' },
  { _id: '106', title: 'General Secretary', description: 'Manages official records and council operations.' },
  { _id: '103', title: 'Cultural Club Head', description: 'Manages all cultural fests and events.' },
  { _id: '104', title: 'Sports Club Head', description: 'Coordinates sports and athletic meets.' },
  { _id: '105', title: 'Technical Club Head', description: 'Leads coding and engineering initiatives.' }
];
let idCounter = 107;

class Position {
  static async find() {
    return positions;
  }
  static async findById(id) {
    return positions.find(p => String(p._id) === String(id));
  }
  constructor(data) {
    this._id = String(idCounter++);
    Object.assign(this, data);
  }
  async save() {
    const existing = positions.find(c => c._id === this._id);
    if (!existing) {
      positions.push(this);
    } else {
      Object.assign(existing, this);
    }
    return this;
  }
  async deleteOne() {
    positions = positions.filter(c => c._id !== this._id);
  }
}

module.exports = Position;
