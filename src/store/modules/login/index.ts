import { defineStore } from "pinia";

const useAppStore = defineStore("app", {
  state:() =>{
    return{
      randomStr:0
   }
}
})
  

export default useAppStore;
