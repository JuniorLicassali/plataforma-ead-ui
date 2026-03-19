import Node from './node';

export default class GenericTree<T> {
  private _root: Node<T> | null = null;
  private _size: number = 0;

  constructor() {}

  root(): Node<T> | null {
    return this._root;
  }

  getAulasLineares(): T[] {
    const aulas: T[] = [];
    if (this._root) this.preOrderRecursive(this._root, aulas);
    return aulas;
  }

  getParent(node: Node<T>): Node<T> | null {
    return node.parent;
  }

  positions(): Node<T>[] {
    const list: Node<T>[] = [];
    if (this._root) this.collectPositions(list, this._root);
    return list;
  }

  private collectPositions(list: Node<T>[], node: Node<T>): void {
    list.push(node);
    for (const child of node.children) {
      this.collectPositions(list, child);
    }
  }

  add(element: T, parent: Node<T> | null = null): Node<T> {
    const newNode = new Node<T>(element, parent);

    if (!parent) {
      this._root = newNode;
    } else {
      parent.addChild(newNode);
    }

    return newNode;
  }

  isRoot(node: Node<T>): boolean {
    return node === this._root;
  }

  private preOrderRecursive(node: Node<T> | null, lista: T[]): void {
    if (!node) return;

    if (node.isLeaf()) {
      lista.push(node.element);
    }

    for (const child of node.children) {
      this.preOrderRecursive(child, lista);
    }
  }
}
