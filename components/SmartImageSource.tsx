import React, {useState} from 'react'
import {Dialog, Flex, Spinner, Stack, Box, TextInput, Button, Card} from '@sanity/ui'

import {AssetSourceComponentProps, AssetFromSource} from 'sanity'
import {openai} from '../openai'

export const SmartImageAssetSource = (props: AssetSourceComponentProps) => {
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [image, setImage] = useState('')

  const generate = async () => {
    setImage('')
    setLoading(true)
    try {
      const {data: res} = await openai.createImage({
        prompt,
        n: 1,
        size: '512x512',
        response_format: 'b64_json',
      })
      const b64 = res.data[0].b64_json
      const image = `data:image/png;base64,` + b64
      if (image) setImage(image)
      setLoading(false)
    } catch {
      setLoading(false)
      alert('Unable to generate image due to an error')
    }
  }

  const handleSelect = async () => {
    setLoading(true)
    try {
      const blob = await (await fetch(image)).blob()
      const url = URL.createObjectURL(blob)

      const asset: AssetFromSource = {
        kind: 'url',
        value: image,
        assetDocumentProps: {
          _type: 'sanity.imageAsset',
          source: {
            name: 'openai.dell-e',
            url,
            id: `${Date.now()}-${prompt}`,
          },
          description: prompt,
          creditLine: `${prompt} by openai.dall-e`,
        } as any,
      }
      props.onSelect([asset])
      setLoading(false)
    } catch (error) {
      setLoading(false)
      alert('Unable to select this image due to an error')
    }
  }

  const handleClose = () => {
    props.onClose()
  }

  const clear = () => {
    setImage('')
    setPrompt('')
  }
  return (
    <Dialog
      id="smart-image-asset-source"
      header="Generate Image from Text"
      onClose={handleClose}
      open
      width={4}
    >
      <Stack space={3} padding={4}>
        <Flex align={'center'} gap={2}>
          <Box flex={1}>
            <TextInput
              disabled={loading}
              value={prompt}
              onChange={(e) => setPrompt(e.currentTarget.value)}
              placeholder="Enter text here..."
              label="Generate from text"
            ></TextInput>
          </Box>
          <Flex align="center" justify={'center'} gap={2}>
            {image ? (
              <>
                <Button onClick={generate} disabled={loading} padding={2} tone="primary">
                  Generate Again
                </Button>
                <Button onClick={clear} disabled={loading} padding={2} tone="default">
                  Clear
                </Button>

                <Button onClick={handleSelect} disabled={loading} padding={2} tone="positive">
                  Select
                </Button>
              </>
            ) : (
              <Button
                onClick={generate}
                disabled={loading || prompt.length === 0}
                padding={2}
                tone="primary"
              >
                Generate
              </Button>
            )}
          </Flex>
        </Flex>
        {loading ? (
          <Flex align="center" justify="center" padding={3}>
            <Spinner />
          </Flex>
        ) : (
          ''
        )}
        {image ? (
          <Card marginTop={4}>
            <img
              style={{backgroundColor: '#eee', width: '100%', objectFit: 'contain'}}
              src={image}
              alt={prompt}
              height={300}
            />
          </Card>
        ) : (
          ''
        )}
      </Stack>
    </Dialog>
  )
}
