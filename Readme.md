## useReducer with thunk
#### To get it working:

```
import useReducerWithThunk from "use-reducer-thunk";

function App() {
    const [state, dispatch] = useReducerWithThunk(reducerFn, initialState); 
    function fetchData() {
        dispatch(fetchDataActionCreator());
    }
    
    return <button onClick={fetchData}>Fetch Data</button> 
}

function fetchDataActionCreator = () => 
    async (dispatch, state) => {
        dispatch({type:"FETCH"});
        try {
            const response = await fetch("https://my-request-url.com/");
            dispatch({type:"FETCH_SUCCESS", data: response.data});
        }catch(e){
            dispatch({type:"FETCH_ERROR", error: e.message});
        }
};
```

