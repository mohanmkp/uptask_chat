


export function MessageMap(chatMsg){
  
    return(
      <>
       {Object.keys(chatMsg).map((key, index) =>(
        <>
         <div className="col-start-1 col-end-13 p-3 rounded-lg mx-5" key={index}>
              <p className='date-seprate'><small>{key}</small></p>
            </div>
         {/* array map */}
         {chatMsg[key].map((msg, i)=>(
            <>
              {msg.is_send ?  <div className="col-start-6 col-end-13 p-3 rounded-lg " key={i}>
            <div className="flex items-center justify-start flex-row-reverse">
              <div className="relative mr-3 text-sm bg-indigo-100 py-1 px-4 shadow rounded-xl">
              <div className='flex'>
                  <p>{msg.message}</p>
                    <small className='mt-1 ml-2 text-blue-400'>{msg.time}</small>
                </div>
              </div>
            </div>
          </div>
            : 
            <div className="col-start-1 col-end-8 p-3 rounded-lg " key={i}>
            <div className="flex flex-row items-center">
              <div className="relative ml-3 text-sm bg-white py-1 px-4 shadow rounded-xl">
                <div className='flex'>
                  <p>{msg.message}</p>
                    <small className='mt-1 ml-2 text-blue-400'>{msg.time}</small>
                </div>
              </div>
            </div>
          </div>}
            </>
          ))}
           {/*arrya map  */}
         
        </>
      ))}


       
    
    </>
    )
  }