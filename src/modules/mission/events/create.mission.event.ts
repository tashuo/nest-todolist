export class CreateMissionEvent {
  missionId: number;

  public constructor(init?: Partial<CreateMissionEvent>) {
    Object.assign(this, init);
  }
}
