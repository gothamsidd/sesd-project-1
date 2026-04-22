import { Subject } from "../models/Subject";

export class SubjectRepository {
  async create(data: any) {
    return Subject.create(data);
  }

  async findByUser(userId: string) {
    return Subject.find({ userId });
  }

  async findById(id: string, userId: string) {
    return Subject.findOne({ _id: id, userId });
  }

  async delete(id: string, userId: string) {
    return Subject.findOneAndDelete({ _id: id, userId });
  }
}
