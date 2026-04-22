import { Task } from "../models/Task";

export class TaskRepository {
  async create(data: any) {
    return Task.create(data);
  }

  async findByUser(userId: string) {
    return Task.find({ userId });
  }

  async findById(id: string, userId: string) {
    return Task.findOne({ _id: id, userId });
  }

  async update(id: string, userId: string, data: any) {
    return Task.findOneAndUpdate({ _id: id, userId }, data, { new: true });
  }

  async delete(id: string, userId: string) {
    return Task.findOneAndDelete({ _id: id, userId });
  }
}
