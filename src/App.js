import React, { useState, useEffect } from 'react';
import './App.css';

import Amplify, { API , graphqlOperation } from "aws-amplify";
import { getStore, listStores} from './graphql/queries'
import { createStore, updateStore } from './graphql/mutations'
import { onUpdateStore } from './graphql/subscriptions';

import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

let subscription;

function App() {
  const [store, setStore] = useState();
  // const [count, setCount] = useState(0);

  const incrementCount = (val) => {
    // setCount(count + val);
    sendUpdate(store.currentCount + val);
  }

  useEffect(() => {
    if (store === undefined) {
      locateStore();
    }
  });

  const locateStore = async () => {
    console.log("listing items");
    const allItems = await API.graphql(graphqlOperation(listStores));
    console.log(JSON.stringify(allItems));

    if (allItems["data"]["listStores"]["items"].length == 0) {
      console.log("Initialiseing store")
      const store = await API.graphql(graphqlOperation(createStore, { input: {  name: "Cevo BusyPlace", currentCount: 0 }}));
      console.log(store);
    }
    else {
      const store = allItems["data"]["listStores"]["items"][0];
      console.log("Found store " + store);
      setStore(store);

      subscription = API.graphql(
        graphqlOperation(onUpdateStore, {id: store.id })
      ).subscribe({
        next: (storeData) => {
          console.log(storeData);
          // Do something with the data
          setStore(storeData.value.data.onUpdateStore);
        }
      });

    }
  };
  
  const sendUpdate = (counter) => {
    console.log("Send update " +counter)
    API.graphql(graphqlOperation(updateStore, { input: { id: store.id, currentCount: counter }}));
  }

  return (
    <div className="app">
      {(typeof store != "undefined") ? (
        <main>
          <div className="location">
           {store.name}
          </div>
          <div className="current-count">
            <div className={(store.currentCount < 50) ? "value safe" : (store.currentCount > 90) ? "value danger" : "value warn"}>{store.currentCount}</div>
          </div>
          <div className="add-buttons">
            <button onClick={() => incrementCount(1)}>+1</button>
            <button onClick={() => incrementCount(2)}>+2</button>
            <button onClick={() => incrementCount(5)}>+5</button>
          </div>
          <div className="remove-buttons">
            <button onClick={() => incrementCount(-1)}>-1</button>
            <button onClick={() => incrementCount(-2)}>-2</button>
            <button onClick={() => incrementCount(-5)}>-5</button>
          </div>
        </main>
       ) : (        
          <main>
            <div className="current-count">
              <div className="value initial safe">Loading...</div>
            </div>
          </main>
      )}
    </div>
  );
}

export default App;
