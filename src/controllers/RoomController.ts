import { Request, Response } from "express";

import { roomRepository } from "./../repositories/roomRepository";
import { subjectRepository } from "./../repositories/subjectRepository";
import { videoRepository } from "./../repositories/videoRepository";

export class RoomController {
  async create(req: Request, res: Response) {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "O nome e obrigatório" });
    }
    try {
      const newRoom = roomRepository.create({ name });
      await roomRepository.save(newRoom);
      return res.status(201).json(newRoom);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async createVideo(req: Request, res: Response) {
    const { title, url } = req.body;
    const { roomId } = req.params;
    if (!title) {
      return res.status(400).json({ message: "O title e obrigatório" });
    }
    try {
      const roomExists = await roomRepository.findOneBy({ id: Number(roomId) });
      if (!roomExists) {
        return res.status(404).json({ message: "Room not exists" });
      }
      const newVideo = videoRepository.create({ title, url, room: roomExists });
      await videoRepository.save(newVideo);
      return res.status(201).json(newVideo);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async createRoomSubject(req: Request, res: Response) {
    const { subject_id } = req.body;
    const { roomId } = req.params;
    try {
      const roomExists = await roomRepository.findOneBy({ id: Number(roomId) });
      if (!roomExists) {
        return res.status(404).json({ message: "Room not exists" });
      }
      const subjectExist = await subjectRepository.findOneBy({
        id: Number(subject_id),
      });
      if (!subjectExist) {
        return res.status(404).json({ message: "Subject not exists" });
      }
      const roomUpdated = {
        ...roomExists,
        subjects: [subjectExist],
      };
      await roomRepository.save(roomUpdated);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async listRooms(req: Request, res: Response) {
    try {
      const rooms = await roomRepository.find({
        relations: {
          subjects: true,
        },
      });
      return res.json(rooms)
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
