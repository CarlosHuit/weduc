const t = () => {

  // let db: IDBDatabase;
  let db;
  const idb = window.indexedDB;
  const customerData = [
    { ssn: '444-44-4444', name: 'Bill', age: 35, email: 'bill@company.com' },
    { ssn: '555-55-5555', name: 'Donna', age: 32, email: 'donna@home.org' }
  ];

  if (!idb) {
    console.log('No disponible');
  }

  if (idb) {
    const request = idb.open('MyDataBase', 1);

    request.onerror = function (event) {
      console.log(event);
    };

    request.onsuccess = function (event) {
      db = request.result;
      console.log(db);
    };

    request.onupgradeneeded = function (event: any) {
      db = event.target.result;
      const objectStore = db.createObjectStore('customers', { keyPath: 'ssn' });

      objectStore.createIndex('name', 'name', { unique: false });

      objectStore.createIndex('email', 'email', { unique: true });

      objectStore.transaction.oncomplete = () => {
        const customerObjectStore = db.transaction('customers', 'readwrite').objectStore('customers');
        for (const i in customerData) {
          if (customerData.hasOwnProperty(i)) {
            const element = customerData[i];
            customerObjectStore.add(element);
          }
        }
      };
    };

  }

};
