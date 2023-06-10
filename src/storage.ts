import { update, appState } from "./index";

export class Storage {
  constructor() {
    const jade = this.getCookieValue("jade");
    if (jade.length > 0) {

      // hydrate local storage
      if (this.getLocalStorageKeys().length == 0) {
        // db.fetch().then(({ items }) => {
        //   items.forEach((item: { [key: string]: any }) => {
        //     localStorage.setItem(item.key, item.value);
        //   });
        //   update({ type: "LOAD_BUFFER", payload: 0 });
        // });
      }

      setInterval(() => {
        const key = `jade-${appState.buffer}`;
        const value = localStorage.getItem(key);
        if (value) {
          const bufferValue = JSON.stringify(appState.editor.doc.toJSON());
          if (bufferValue !== value) {
            // db.put({ key, value: bufferValue });
          }
        }
      }, 100);
    }
  }

  private getCookieValue(key: string): string {
    return (
      document.cookie.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`)?.pop() || ""
    );
  }

  private getLocalStorageKeys(): string[] {
    return Object.keys(localStorage).filter((key: string) => {
      return key.startsWith("jade-");
    });
  }

  public get(key: string): { [key: string]: any } | null {
    const value = localStorage.getItem(`jade-${key}`);
    if (value) {
      return JSON.parse(value);
    }

    return null;
  }

  public set(key: string, newData: any): void {
    setTimeout(() => {
      const newValue = JSON.stringify(newData);
      localStorage.setItem(`jade-${key}`, newValue);
    }, 100);
  }
}
