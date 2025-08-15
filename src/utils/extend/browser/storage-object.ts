import {useCallback, useEffect, useState} from 'react';

export interface StorageObjectParameter<V extends object> {
  key: string;
  storage: 'LOCAL_STORAGE' | 'SESSION_STORAGE';

  /**
   * 애초에 매니저 생성할 때부터 유효성검증로직을 선택적으로 추가하여,
   * Storage에 값을 읽거나 쓸때 유효하지않은값이 읽히거나 써지지않도록 함.
   */
  validateCallback?: (parsedValue: V) => boolean;
  defaultValue: V;
  //TODO legacyKeys (array) 받아서 옛날 키값이면 삭제하는 기능 추가하자. StorageManagerObject ~ Array 둘다 적용되게.
}

/**
 * @description 스토리지에 Object를 쉽고 안전하게 읽고 쓰기위해 만들었습니다.
 * 1. 매번 중복되는 코드를 제거하기 위해.
 * 2. localStorage | sessionStorage의 key는 문자열이라서 오타로인해 잘못 읽고 쓸 우려가 있어서.
 */
export class StorageObjectManager<V extends object> {
  /**
   * @private
   * I think derived classes are need not access the key.
   * Instead, derived classes can use super's methods.
   */
  private readonly key: string;
  private readonly validateCallback: StorageObjectParameter<V>['validateCallback'];
  private readonly defaultValue: V;
  private readonly storage: Storage;

  constructor({key, validateCallback, defaultValue, storage}: StorageObjectParameter<V>) {
    this.key = key;
    this.validateCallback = validateCallback;
    this.defaultValue = defaultValue;

    try {
      switch (storage) {
        case 'LOCAL_STORAGE':
          this.storage = localStorage;
          break;

        case 'SESSION_STORAGE':
          this.storage = sessionStorage;
      }
      // server side 오류 무시
    } catch (error) {
      // TODO client component에서 이 매니저 클래스 인스턴스를 만들 때 Server Side에서는 생성 될 이유가 없는데 어떻게 하는게 좋을까,
      this.storage = null as any;
      return;
    }

    if (!this.getItem()) {
      this.setStringifyItem(defaultValue);
    }
  }

  /**
   * @private
   * Instead of this private method, use setStringifyItem().
   */
  private setItem(value: string) {
    try {
      this.storage.setItem(this.key, value);
    } catch (error) {
      return;
    }
  }

  /**
   * @private
   * Instead of this private method, use parseItem().
   */
  private getItem() {
    try {
      return this.storage.getItem(this.key);
    } catch (error) {
      return null;
    }
  }

  removeItem() {
    this.storage.removeItem(this.key);
  }

  setStringifyItem(value: V) {
    if (this.validateCallback && !this.validateCallback(value)) {
      throw new Error(`setStringifyItem() is failed. because you set the validateCallback but the value is invalidated. value=${JSON.stringify(value)}`);
    }

    try {
      this.setItem(JSON.stringify(value));
    } catch (error) {
      throw error;
    }
  }

  getParsedData(): V {
    try {
      const item = this.getItem();

      if (item === null) {
        return this.defaultValue;
      }

      const parsedItem = JSON.parse(item);

      if (!this.validateCallback) {
        return parsedItem;
      }

      /**
       * 대부분의 걍우, Storage에 개발자가 값을 저장할 때 유효한 형태로 저장을 하게되어,
       * 유효하지않은 값이 저장될일이 잘 없음.
       *
       * 하지만, 유효하지않은 값이 저장될 가능성자체는 존재함.
       * 1. 유저가 수정한경우
       * 2. 개발자가 실수한경우
       *
       * 이런경우 해당 키로된 데이터를 아예 삭제해서 처음부터 로직을 다시 탈 수 있도록 함.
       */
      if (!this.validateCallback(parsedItem)) {
        this.storage.removeItem(this.key);
        console.error(`The data of ${this.key} is not validated. this data is cleared.`);
        return this.defaultValue;
      }

      return parsedItem;
    } catch (error) {
      // SyntaxError (JSON.parse()) 또는 validateCallback()에서 에러가 발생할 수 있음.
      console.error(error);
      this.storage.removeItem(this.key);
      return this.defaultValue;
    }
  }
}

/**
 * @description
 * StorageObjectManager: 단순히 스토리지에 읽고 쓰는것만 도와줍니다.
 * useStorageObjectManager: 스트토리지에 저장된 값이 변할때 화면도 따라 변하는것을 쉽게 구현하도록 도와줍니다.
 */
export function useStorageObjectManager<V extends object>(manager: StorageObjectManager<V>) {
  const [state, setState] = useState(manager.getParsedData());
  const [isHydrating, setIsHydrating] = useState(true);

  const changeState = useCallback((value: V) => {
    try {
      manager.setStringifyItem(value);
      setState(value);
    } catch (error) {
      console.error(error);
    }
  }, [manager]);

  useEffect(() => {
    setIsHydrating(false);
  }, []);

  return {
    state,
    isHydrating, // 이 hooks 사용하는곳에서 hydrating 과정에사 렌더링되지않도록 활용. 안그러면 Hydration Error가 발생함.
    changeState
  };
}
