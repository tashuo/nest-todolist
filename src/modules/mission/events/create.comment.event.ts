export class CreateCommentEvent {
  commentId: number;

  public constructor(init?: Partial<CreateCommentEvent>) {
    Object.assign(this, init);
  }
}
