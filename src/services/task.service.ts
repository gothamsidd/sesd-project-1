import { TaskRepository } from "../repositories/task.repository";
import { SubjectRepository } from "../repositories/subject.repository";

export class TaskService {
  repo = new TaskRepository();
  subjectRepo = new SubjectRepository();

  async create(data: { title: string; userId: string; subjectId: string }) {
    const subject = await this.subjectRepo.findById(data.subjectId, data.userId);
    if (!subject) {
      throw new Error("Subject not found or does not belong to user");
    }
    return this.repo.create(data);
  }

  async getAll(userId: string) {
    return this.repo.findByUser(userId);
  }

  async update(id: string, userId: string, data: any) {
    return this.repo.update(id, userId, data);
  }

  async delete(id: string, userId: string) {
    return this.repo.delete(id, userId);
  }
}
