import {observer} from "mobx-react-lite";


export const TestDebug = () => {

    const clicke = () => {
        console.log("salut")
    }

    return <>
        <div> bonjour</div>
        <button onClick={() => clicke()}></button>
    </>
}
