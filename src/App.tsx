import 'bootstrap/dist/css/bootstrap.min.css';
import { ArrowsIcon, ClipboardIcon, SpeakerIcon } from './components/Icons';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './App.css'
import { useStore } from './hooks/useStore';
import { AUTO_LANGUAGE, VOICE_FOR_LANGUAGE } from './constants';
import { LanguageSelector } from './components/LanguageSelector';
import { SectionType } from './types.d';
import { Stack } from 'react-bootstrap'
import { TextArea } from './components/TextArea';
import { useEffect } from 'react';
import { useDebounce } from './hooks/useDebounce';
import { translate } from './services/translate';

function App() {
  const {fromLanguage, toLanguage, fromText, result, loading, setFromText, setResult, interchangeLanguages, setFromLanguage , setToLanguage} = useStore()
  
  const debouncedFromText = useDebounce(fromText, 300) 

  useEffect(() => {
    if(debouncedFromText === '') return 

    translate({ fromLanguage, toLanguage, text: debouncedFromText })
      .then(result => {
        if(result == null ) return
        setResult(result)
      })
      .catch(() => { setResult('Error') })
  }, [debouncedFromText, fromLanguage, toLanguage])

  const handleClipboard = () => {
    navigator.clipboard.writeText(result).catch(() => {})
  }
  
  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(result)
    utterance.lang = VOICE_FOR_LANGUAGE[toLanguage]
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }

  return (
    <Container fluid className='text-center'>
      <h2>Translate</h2>
      <hr></hr>
      <br></br>
      <Row>
        <Col>
          <Stack gap={2}>
            <LanguageSelector type={SectionType.From} value={fromLanguage} onChange={setFromLanguage}/>
            <TextArea
              type={SectionType.From}
              value={fromText}
              onChange={setFromText}
            />
          </Stack>
        </Col>
        <Col xs='auto'>
          <Button variant='link' disabled={fromLanguage === AUTO_LANGUAGE} onClick={interchangeLanguages}>
            <ArrowsIcon />
          </Button>
        </Col>
        <Col>
          <Stack gap={2}>
            <LanguageSelector type={SectionType.To} value={toLanguage} onChange={setToLanguage}/>
            <div style={{ position: 'relative'}}>
            <TextArea
              loading={loading}
              type={SectionType.To}
              value={result}
              onChange={setResult}
            />
            <div style={{ position: 'absolute', left: 0, bottom: 0, display: 'flex'}}>
              <Button variant='link' onClick={handleClipboard}><ClipboardIcon/></Button>
              <Button variant='link' onClick={handleSpeak}><SpeakerIcon/></Button>
            </div>
            </div>
          </Stack>
        </Col>
      </Row>
    </Container>
  )
}

export default App
