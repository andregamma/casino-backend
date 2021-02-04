export interface Transformer<Entity, Options> {
  transform: (entity: Entity, options: Options) => any;
}
