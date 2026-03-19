export default class Node<T> {
  private _element: T;
  private _parent: Node<T> | null;
  private _children: Node<T>[];

  constructor(element: T, parent: Node<T> | null = null) {
    this._element = element;
    this._parent = parent;
    this._children = [];
  }

  get element(): T { return this._element; }
  get parent(): Node<T> | null { return this._parent; }
  get children(): Node<T>[] { return this._children; }

  addChild(child: Node<T>): void {
    this._children.push(child);
  }

  isLeaf(): boolean {
    return this._children.length === 0;
  }
}
