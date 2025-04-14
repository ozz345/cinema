// { id: uuidv4(), ...action.payload }

const initialState = {

  UsersDB: [ ],


};

// state - current state
// action - { type: 'WHAT_TO_DO', [payload: value] }
const counterReducer = (state = initialState, action) => {
  switch (action.type) {

    case 'LOAD': {
      return { ...state, Products: action.payload };
    }

  }
};

export default counterReducer;



// id: 0,
// firstname:'',
// lastname:'',
// age:0