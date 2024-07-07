export interface IEntityWihtCount<E> {
  readonly rows: Array<E>;

  readonly count: number;
}
