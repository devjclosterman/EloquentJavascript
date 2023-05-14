const roads = [
    "Alice's House-Bob's House",
    "Alice's Houe-Post Office",
    "Daria's House-Ernie's House",
    "Ernie's House-Grete's House",
    "Grete's House-Shop",
    "Marketplace-Post Office",
    "Marketplace-Town Hall",
    "Alice's House-Cabin",
    "Bob's House-Town Hall",
    "Grete's House-Farm",
    "Marketplace-Farm",
    "Marketplace-Shop",
    "Shop-Town Hall"
  ];
  
  const buildGraph = (edges) => {
    let graph = Object.create(null);
    function addEdge(from, to) {
      if(graph[from] == null) {
        graph[from] = [to];
      } else {
        graph[from].push(to);
      }
    }
    for (let [from, to] of edges.map(r => r.split("-"))) {
      addEdge(from, to)
      addEdge(to, from)
    }
    return graph;
  }
  
  const roadGraph = buildGraph(roads);
  console.log(roadGraph)
  
  class VillageState {
    constructor(place, parcels) {
      this.place = place;
      this.parcels = parcels;
    }
    move(destination) {
      if(!roadGraph[this.place].includes(destination)) {
        return this;
      } else {
        let parcels = this.parcels.map(p => {
          if(p.place != this.place) return p;
          return {place: destination, address: p.address};
        }).filter(p => p.place != p.address);
        return new VillageState(destination, parcels);
      }
    }
  }
  
  let first = new VillageState(
    "Post Office",
    [{ place: "Post Office", address: "Alice's House" }]
  );
  let next = first.move("Alice's House");
  
  console.log(next.place)
  // Alices House
  console.log(next.parcels);
  // []
  console.log(first.place)
  // post Office
  
  //Data structures that don't change are
  // called immutable or persistent
  // let object = Object.freeze({value: 5});
  // object.value = 10;
  // console.log(object.value)
  // 5
  
  function runRobot(state, robot, memory) {
    for(let turn = 0;; turn++) {
      if(state.parcels.length == 0) {
        console.log(`Done int ${turn} turns`);
        break;
      }
      let action = robot(state, memory);
      state = state.move(action.direction);
      memory = action.memory;
      console.log(`Moved to ${action.direction}`);
    }
  }
  
  
  //random robot with no memory
  // function randomPick(array) {
  //   let choice = Math.floor(Math.random() * array.length);
  //   return array[choice];
  // }
  // function randomRobot(state) {
  //   return { direction: randomPick(roadGraph[state.place]) }
  // }
  
  
  // VillageState.random = function(parcelCount = 5) {
  //   let parcels = [];
  //   for (let i = 0; i < parcelCount; i++) {
  //     let address = randomPick(Object.keys(roadGraph));
  //     let place;
  //     do {
  //   place = randomPick(Object.keys(roadGraph))
  //     } while (place == address);
  //     parcels.push({ place, address });
  // }
  // return new VillageState("Post Office", parcels);
  // };
  //We don't want any parcels that are sent from the same place
  //that they are addressed to
  
  // runRobot(VillageState.random(), randomRobot);
  // Moved to marketplace
  // Moved to Town hall
  //......
  //Done in 63 turns
  
  
  
  //instead of random do like the real world post office
  // const mailRoute = [
  //   "Alice's House", "Cabin", "Alice's House", "Bob's House",
  //   "Town Hall", "Daria's House", "Ernie's House",
  //   "Grete's House", "Shop", "Grete's House", "Farm",
  //   "Marketplace", "Post Office"
  // ];
  
  // function routeRobot(state, memory) {
  //   if(memory.length == 0) {
  //     memory = mailRoute;
  //   }
  //   return { direction: memory[0], memory: memory.slice(1) }
  // };
  
  //following a path isnt that great but better than random
  
  
  //PathFinding
  // function findRoute(graph, from, to) {
  //   let work = [{ at: from, route: [] }]
  //   for(let i = 0; i < work.length; i ++) {
  //     let { at, route } = work[i];
  //     for (let place of graph[at]) {
  //       if(pace == to) return route.concat(place);
  //       if(!work.some(w => w.at == place)) {
  //         work.push({at: place, route: route.concat(place)})
  //       }
  //     }
  //   }
  // };
  
  //this is better than the route Robot
  function goalOrientedRobot({place, parcels}, route) {
    if(route.length == 0) {
      let parcel = parcels[0];
      if(parcel.place != place) {
        route = findRoute(roadGraph, place, parcel.place);
      } else {
        route - findRoute(roadGraph, place, parcel.address);
      }
    }
    return {direction: route[0], memory: route.slice(1)};
  }


  // let bombTimer = setTimeout(() => {
//   console.log("BOOM!");
// }, 500)

// if (Math.random() < 0.5) {
//   console.log("Defused...");
//   clearTimeout(bombTimer);
// }

let ticks = 0;
let clock = setInterval(() => {
  console.log("tick", ticks++);
  if(ticks === 10) {
    clearInterval(clock);
    console.log("stop...")
  }
}, 200);

let scheduled = null;
window.addEventListener("mousemove", event => {
  if(!scheduled) {
    setTimeout(() => {
      document.body.textContent = 
      `Mouse at ${scheduled.pageX}, ${scheduled.pageY}`;
      scheduled = null;
    }, 250);
  }
  scheduled = event;
})