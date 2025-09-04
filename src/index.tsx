import {
  Dropdown,
  ServerAPI,
  ButtonItem,
  ToggleField,
  definePlugin,
  PanelSection,
  staticClasses,
  DropdownOption,
  PanelSectionRow,
} from "decky-frontend-lib";
import { FunctionComponent, useState, useMemo } from "react";
import { FaMicrophone, FaStopCircle, FaPaperPlane } from "react-icons/fa";

// Interface for the SpeechRecognition API
// This is needed because the default TS types might not have it
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Backend function to send text
async function sendTextToKeyboard(text: string) {
	if (text) {
		// Using the SteamClient global to interact with the keyboard
		// We cast to `any` because the default Decky types may not include the keyboard API
		await (SteamClient as any).keyboard.SendText(text);
		return true;
	}

	return false;
}

const Content: FunctionComponent<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [autoSend, setAutoSend] = useState(true);
  const [selectedLang, setSelectedLang] = useState('en-US'); // New state for language

  // Memoize the recognition object so it's not recreated on every render
  const recognition = useMemo(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser.");
      return null;
    }

    const instance = new SpeechRecognition();
    instance.continuous = true;
    instance.interimResults = true;

    return instance;
  }, []);


  if (recognition) {
    recognition.onstart = () => {
      setIsListening(true);
      setCurrentTranscript("");
    };

    recognition.onend = () => {
      setIsListening(false);

      if (autoSend && currentTranscript.trim()) {
        serverAPI.callPluginMethod('send_text', { text: currentTranscript.trim() + ' ' });
      }

      setCurrentTranscript("");
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setCurrentTranscript(finalTranscript || interimTranscript);
    };
  }

  const startRecognition = () => {
    if (recognition && !isListening) {
      recognition.lang = selectedLang; // Set language before starting
      recognition.start();
    }
  };

  const stopRecognition = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const handleSendText = () => {
    if (currentTranscript.trim()) {
      serverAPI.callPluginMethod('send_text', { text: currentTranscript.trim() + ' ' });
      // Optionally clear transcript after manual send
      setCurrentTranscript("");
    }
  };

  // Language options for the dropdown
  const languageOptions: DropdownOption[] = [
    { label: 'English (US)', data: 'en-US' },
    { label: 'English (UK)', data: 'en-GB' },
    { label: 'Español (España)', data: 'es-ES' },
    { label: 'Français', data: 'fr-FR' },
    { label: 'Deutsch', data: 'de-DE' },
    { label: 'Italiano', data: 'it-IT' },
    { label: '日本語', data: 'ja-JP' },
    { label: '한국어', data: 'ko-KR' },
    { label: 'Português (Brasil)', data: 'pt-BR' },
    { label: 'Русский', data: 'ru-RU' },
    { label: '中文 (简体)', data: 'cmn-Hans-CN' },
  ];

  if (!recognition) {
    return (
      <PanelSection title="Speech-To-Deck">
        <PanelSectionRow>
          Speech recognition is not supported in this browser.
        </PanelSectionRow>
      </PanelSection>
    );
  }

  return (
    <PanelSection title="Speech-To-Deck">
       <PanelSectionRow>
        <Dropdown
          menuLabel="Language"
          rgOptions={languageOptions}
          selectedOption={selectedLang}
          onChange={(option) => setSelectedLang(option.data)}
        />
      </PanelSectionRow>

      <PanelSectionRow>
        <div style={{ flex: 1, whiteSpace: 'normal', wordBreak: 'break-word', background: '#1a1a1a', padding: '8px', borderRadius: '4px', minHeight: '40px', color: '#ffffff' }}>
          {currentTranscript || (isListening ? "Listening..." : "Press Start to begin")}
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          {!isListening ? (
            <ButtonItem
              layout="below"
							icon={<FaMicrophone />}
              label="Start Listening"
              onClick={startRecognition}
            ></ButtonItem>
          ) : (
            <ButtonItem
              layout="below"
							icon={<FaStopCircle />}
              label="Stop"
              onClick={stopRecognition}
            ></ButtonItem>
          )}

          <ButtonItem
            layout="below"
						icon={<FaPaperPlane />}
            label="Send Text"
            disabled={isListening || !currentTranscript.trim() || autoSend}
            onClick={handleSendText}
          ></ButtonItem>
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <ToggleField
          label="Auto-send text on pause"
          checked={autoSend}
          onChange={(value) => setAutoSend(value)}
        />
      </PanelSectionRow>
    </PanelSection>
  );
};


export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>Speech-To-Deck</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaMicrophone />,
    onDismount() {
      // Cleanup if needed
    },
    // Backend definition
    backend: {
      send_text: async (params: { text: string }) => {
        return await sendTextToKeyboard(params.text);
      },
    },
  };
});

