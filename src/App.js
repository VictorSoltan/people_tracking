import React from 'react';
import axios from 'axios'
import { Player } from 'video-react';
import './App.css';

function App() {

  let selectedFile = React.useRef(null),
  [info, setInfo] = React.useState({}),
  [link, setLink] = React.useState({}),
  [defaultVideo, setDefaultVideo] = React.useState(false),
  [loading, setLoading] = React.useState(false),
  backAddress = "http://127.0.0.1:8000"
  // backAddress = "http://45.129.97.220:8000"

  const handleFileSelect = (event) => {
    selectedFile.current = event.target.files[0]
  }

  // useEffect(() => {
  //   axios.get(backAddress)
  //   .then((res) => {
  //     console.log(res)
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
  // }, [])

  const handleSubmit = async(event) => {
    event.preventDefault()
    let formData = new FormData();
    formData.append("data", selectedFile.current);
    try {
        const file = selectedFile.current;
        const form = new FormData();
        form.append('file', file);
        setLoading(true)
        axios.post(`${backAddress}/uploadfile/`, form, {
            headers: {'Content-Type': 'multipart/form-data'}
        })        
        .then((res) => {
            setLoading(false)
            console.log('res', res.data)
            setDefaultVideo(false)
            setLink({mainFile: res.data.mainFile, mask: res.data.mask})
            setInfo(res.data.info)
            // setFolders(res.data)
            // setFolderName(res.data[0])
        })
        .catch((res) => {
          setLoading(false)
        })

    } catch(err) {
      console.log(err)
    }
  }

  function styleButton(e){
    e.target.style.transform = 'scale(0.95)'; e.target.style.opacity = '0.8'
  }

  function returnStyleButton(e){
    e.target.style.transform = 'scale(1)'; e.target.style.opacity = '1'
  }

  function startTwoVideo(){
    let videos = document.querySelectorAll('video')
    for(let x=0; x<videos.length; x++){
      videos[x].play()
    }
  }

  return (
    <div className="App">     
      <h1>People tracking</h1>
        {!defaultVideo&&!loading && <button onClick={() => setDefaultVideo(!defaultVideo)}>See default video</button>}        
        {defaultVideo&&!loading ? 
          <>
            <div className='videos'>
              <div className='video'>
                <Player>
                  <source src={`${backAddress}/video/mltce_ouput.webm`} controls={true} />
                </Player>
              </div>
              <div className='video'>
                <Player>
                  <source src={`${backAddress}/video/mltce_mask_ouput.webm`} controls={true} />
                </Player>
              </div> 
            </div> 
            <button style={{marginTop: '20px'}} onClick={() => startTwoVideo()}>Play two video together</button>
          </>
          : link.mainFile&&link.mask&&!loading ?
          <>
            <div className='videos' >
              <div className='video'>
                <Player>
                  <source src={`${backAddress}/video/${link.mainFile}`} controls={true} />
                </Player>
                {info && <h4>{"total: " + info.total + ", enter: " + info.enter + ", exit: " + info.exit  }</h4>}
              </div>
              <div className='video'>
                <Player>
                  <source src={`${backAddress}/video/${link.mask}`} controls={true} />
                </Player>
              </div>
            </div>
            <button style={{marginTop: '20px'}} onClick={() => startTwoVideo()}>Play two video together</button>
          </>
          : loading ? 
            <div className='load'/>  
          : <h2>or... Choose a video for upload</h2>
        }   
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileSelect} accept="video/*"/>
        <input type="submit" value="Upload File" 
          onMouseDown={e => styleButton(e)} onMouseLeave={e => returnStyleButton(e)} 
          onMouseUp={e => returnStyleButton(e)} onMouseOut={e => returnStyleButton(e)} />
      </form>            
    </div>
  );
}

export default App;
