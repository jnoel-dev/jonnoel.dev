import Defaults from '../components/defaults';
import Panel from '../components/panel/panel';

function HomePage() {
    return (
    <>
      <Defaults>
      <div style={{

        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: '25%',
        pointerEvents: 'none'
     
      }}>
      <h1 className='text-9xl font-extrabold text-globalColor1 system-ui'>COMING SOON</h1>
      </div>

      </Defaults>
      
    </>
    )
  }
  
  export default HomePage