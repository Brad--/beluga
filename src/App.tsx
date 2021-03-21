import './App.css'

import HlsPlayer from './components/HlsPlayer'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app-container">
      <Header></Header>
      <HlsPlayer 
        autoPlay={false}
        controls={true}
        url={'http://localhost:8080/mirrorgirl/mirrorgirl.m3u8'}></HlsPlayer>
      <Footer></Footer>
    </div>
  );
}

export default App;
