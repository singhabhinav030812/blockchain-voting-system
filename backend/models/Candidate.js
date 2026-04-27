let candidates = [
  // President Candidates (101)
  { _id: '1', name: 'Aryan Gupta', studentId: 'CS1029', department: 'Computer Science', yearSemester: '4th Year', positionId: '101', manifesto: 'Vision for a modern campus and digital infrastructure.', party: 'Tech Innovators', symbol: '💻', photoUrl: 'https://images.unsplash.com/photo-1541577141970-1bc67efb5e50?w=150', voteCount: 0 },
  { _id: '2', name: 'Neha Desai', studentId: 'EE4091', department: 'Electrical Engineering', yearSemester: '3rd Year', positionId: '101', manifesto: 'Dedicated to transparency and securing more internship drives.', party: 'Student First', symbol: '🦅', photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', voteCount: 0 },
  { _id: '3', name: 'Rohan Chatterjee', studentId: 'ME2011', department: 'Mechanical', yearSemester: '4th Year', positionId: '101', manifesto: 'Better placements and active alumni industry connections.', party: 'Progressive Youth', symbol: '⚙️', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', voteCount: 0 },
  { _id: '4', name: 'Kavita Reddy', studentId: 'CE4022', department: 'Civil Engineering', yearSemester: '4th Year', positionId: '101', manifesto: 'Inclusivity, safety, and much better campus infrastructure.', party: 'Campus United', symbol: '🏗️', photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', voteCount: 0 },
  
  // Vice President Candidates (102)
  { _id: '5', name: 'Siddharth Patel', studentId: 'CS2045', department: 'Computer Science', yearSemester: '3rd Year', positionId: '102', manifesto: 'Supporting the president and amplifying student voices.', party: 'Student First', symbol: '📣', photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', voteCount: 0 },
  { _id: '6', name: 'Ananya Rao', studentId: 'EC3011', department: 'Electronics', yearSemester: '3rd Year', positionId: '102', manifesto: 'Bridging the significant gap between students and administration.', party: 'Campus United', symbol: '🌉', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', voteCount: 0 },

  // General Secretary Candidates (106)
  { _id: '7', name: 'Aditya Singh', studentId: 'ME4021', department: 'Mechanical', yearSemester: '3rd Year', positionId: '106', manifesto: 'Diligent administration, perfect record keeping, and quick problem resolution.', party: 'Progressive Youth', symbol: '📜', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', voteCount: 0 },
  { _id: '8', name: 'Meera Krishnan', studentId: 'IT1055', department: 'Information Tech', yearSemester: '2nd Year', positionId: '106', manifesto: 'Organized and prepared to lead all student affairs effectively.', party: 'Tech Innovators', symbol: '📊', photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', voteCount: 0 }
].map(c => ({ ...c, save: async function() { Object.assign(candidates.find(x => x._id === this._id), this); } }));
let idCounter = 9;

class Candidate {
  static async find(query) {
    if (query && Object.keys(query).length > 0) {
      return candidates.filter(c => Object.keys(query).every(k => c[k] === query[k]));
    }
    return candidates;
  }
  static async findById(id) {
    return candidates.find(c => String(c._id) === String(id));
  }
  constructor(data) {
    this._id = String(idCounter++);
    this.photoUrl = data.photoUrl || 'https://via.placeholder.com/150';
    Object.assign(this, data);
    this.voteCount = 0;
  }
  async save() {
    const existing = candidates.find(c => c._id === this._id);
    if (!existing) {
      candidates.push(this);
    } else {
      Object.assign(existing, this);
    }
    return this;
  }
  async deleteOne() {
    candidates = candidates.filter(c => c._id !== this._id);
  }
}

module.exports = Candidate;
