import { SessionRepository } from "../repositories/session.repository";

export class SessionService {
  repo = new SessionRepository();

  async start(userId: string, subjectId?: string) {
    return this.repo.create({
      userId,
      subjectId,
      startTime: new Date()
    });
  }

  async getAll(userId: string) {
    return this.repo.findByUser(userId);
  }

  async end(sessionId: string, userId: string) {
    const session = await this.repo.findById(sessionId, userId);

    if (!session) {
      throw new Error("Session not found or does not belong to user");
    }

    if (session.endTime) {
      throw new Error("Session already ended");
    }

    const endTime = new Date();
    const startTime = new Date(session.startTime);
    const duration = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 1000
    ); // duration in seconds

    return this.repo.update(sessionId, userId, {
      endTime,
      duration
    });
  }
}
