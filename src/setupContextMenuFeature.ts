import { editor } from 'monaco-editor';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { LinkedList } from 'monaco-editor/esm/vs/base/common/linkedList';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { MenuId, MenuRegistry } from 'monaco-editor/esm/vs/platform/actions/common/actions';

export const setupContextMenuFeature = (editor: editor.IStandaloneCodeEditor) => {
  removeAllMenus();

  addActionWithSubmenus(editor, {
    title: 'Change color',
    context: 'EditorChangeColorContext',
    group: 'edit',
    order: 0,
    actions: [
      {
        id: 'red',
        label: 'Red',
        run: () => console.log('red'),
      },
      {
        id: 'green',
        label: 'Green',
        run: () => console.log('green'),
      },
    ],
  });

  addActionWithSubmenus(editor, {
    title: 'Change coordinates',
    context: 'EditorChangeCoordinatesContext',
    group: 'edit',
    order: 1,
    actions: [
      {
        id: 'wgs',
        label: 'WGS',
        run: () => console.log('wgs'),
      },
      {
        id: 'utc',
        label: 'UTC',
        run: () => console.log('utc'),
      },
      {
        id: 'mgrs',
        label: 'MGRS',
        run: () => console.log('mgrs'),
      },
    ],
  });
};

const addActionWithSubmenus = (
  editor: editor.IStandaloneCodeEditor,
  descriptor: {
    title: string;
    context: string;
    group: string;
    order: number;
    actions: { run: (editor: editor.IStandaloneCodeEditor) => void; label: string; id: string }[];
  }
) => {
  const submenu = new MenuId(descriptor.context);
  const list = new LinkedList();
  MenuRegistry._menuItems.set(submenu, list);

  for (let i = 0; i < descriptor.actions.length; i++) {
    const action = descriptor.actions[i];
    editor.addAction({
      id: action.id,
      label: action.label,
      run: action.run,
      contextMenuOrder: i,
      contextMenuGroupId: descriptor.context,
    });
    const actionId = editor
      .getSupportedActions()
      .find(a => a.label === action.label && a.id.endsWith(action.id))!.id;

    const items = MenuRegistry._menuItems.get(MenuId.EditorContext) as LinkedList;
    const item = popItem(items, actionId);
    if (item) {
      list.push(item);
    }
  }

  MenuRegistry._menuItems.get(MenuId.EditorContext).push({
    group: descriptor.group,
    order: descriptor.order,
    submenu: submenu,
    title: descriptor.title,
  });
};

const popItem = (items: LinkedList, id: string): any => {
    let node = items._first;
    do {
      if (node.element?.command?.id === id) {
        items._remove(node);
        return node.element;
      }
      node = node.next;
    } while (node !== undefined);
  };

const removeAllMenus = () => {
    const contextMenuEntry = MenuRegistry._menuItems.get(MenuId.EditorContext);
    let node = contextMenuEntry._first;
    do {
      if (node.element) {
        contextMenuEntry._remove(node);
      }
      node = node.next;
    } while (node !== undefined);
  };