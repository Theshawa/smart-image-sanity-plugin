import {Configuration, OpenAIApi} from 'openai'

const OPENAI_API_KEY = `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`
const config = new Configuration({
  apiKey: OPENAI_API_KEY,
})

export const openai = new OpenAIApi(config)
