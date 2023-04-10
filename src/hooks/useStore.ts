import { AUTO_LANGUAGE } from '../constants';
import { Action, FromLanguage, Language, type State } from '../types.d';
import { useReducer } from 'react';

// 1. Crear estado inicial
const initialState: State = {
    fromLanguage: 'auto',
    toLanguage: 'en',
    fromText: '',
    result: '',
    loading: false
}

// 2. Crear Reducer
function reducer(state: State, action: Action) {
    const { type } = action

    if (type === 'INTERCHANGE_LANGUAGES') {
        if(state.fromLanguage === AUTO_LANGUAGE) return state

        const loading = state.fromText !== ''

        return {
            ...state,
            loading,
            result: '',
            fromLanguage: state.toLanguage,
            toLanguage: state.fromLanguage,

        }
    }

    if (type === 'SET_FROM_LANGUAGE') {
        if(state.fromLanguage === action.payload) return state

        const loading = state.fromText !== ''
        return {
            ...state,
            fromLanguage: action.payload,
            result: '',
            loading
        }
    }

    if (type === 'SET_TO_LANGUAGE') {
        if(state.toLanguage === action.payload) return state

        const loading = state.fromText !== ''
        return {
            ...state,
            toLanguage: action.payload,
            result: '',
            loading
        }
    }

    if (type === 'SET_FROM_TEXT') {
        const loading = action.payload !== ''
        return {
            ...state,
            loading,
            fromText: action.payload,
            result: ''
        }
    }

    if (type === 'SET_RESULT') {
        return {
            ...state,
            loading: false,
            result: action.payload
        }
    }

    return state
}

export function useStore(){
    const [{
        fromLanguage,
        toLanguage,
        fromText,
        result,
        loading
    }, dispatch] = useReducer(reducer, initialState)

    const interchangeLanguages = () => {
        dispatch({ type: 'INTERCHANGE_LANGUAGES'})
    }

    const setFromLanguage = (payload: FromLanguage) => {
        dispatch({ type: 'SET_FROM_LANGUAGE', payload })
    }

    const setToLanguage = (payload: Language) => {
        dispatch({ type: 'SET_TO_LANGUAGE', payload })
    }

    const setFromText = (payload: string) => {
        dispatch({ type: 'SET_FROM_TEXT', payload })
    }

    const setResult = (payload: string) => {
        dispatch({ type: 'SET_RESULT', payload })
    }

    return {
        fromLanguage,
        toLanguage,
        fromText,
        result,
        loading,
        interchangeLanguages,
        setFromLanguage,
        setToLanguage,
        setFromText,
        setResult
    }
    
}