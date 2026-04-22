import { StudySession } from "../models/StudySession";

export class SessionRepository {
  async create(data: any) {
    return StudySession.create(data);
  }

  async findByUser(userId: string) {
    return StudySession.find({ userId });
  }

  async findById(id: string, userId: string) {
    return StudySession.findOne({ _id: id, userId });
  }

  async update(id: string, userId: string, data: any) {
    return StudySession.findOneAndUpdate({ _id: id, userId }, data, {
      new: true
    });
  }
}
