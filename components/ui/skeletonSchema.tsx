import { Skeleton } from "./skeleton"
type skeletonSchemaProps = {
 grid: number 
}
const skeletonSchema = (props:skeletonSchemaProps)=> {
 const {grid} = props ;
  return (
    Array.from({length: grid}).map((_ , index) =>(
        <div key={index} className="flex flex-col md:gap-2 gap-2 mx-auto space-y-3 mt-10" >
            <Skeleton className=" md:h-[20vh] h-[15vh] w-[10vhh] md:w-[25vh] roundex-xl "/>
            <div >
                <Skeleton className="h-4 w-[15vh] md:h-7 md:w-[25vh] "  />
            </div>
        </div>
    ) 
    )
  )
}

export default skeletonSchema