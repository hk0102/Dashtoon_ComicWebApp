import React, {useState, useEffect, useCallback} from 'react';
import {Form, Input, Button, Row, Col, Card, Image, Spin} from 'antd';
import TextArea from "antd/es/input/TextArea";
import {debounce} from "react-axios/lib/utils";
import axios from "axios";

const ComicGeneratorWithApiImages = () => {
    const [comicRows, setComicRows] = useState(Array(10).fill({ text: '',imageURL:'', imageLoading: false}));


    // Debounce the API request function
    const debouncedApiRequest = useCallback(debounce(async (input, rowIndex) => {
        try {
            const response = await fetch(
                'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud',
                {
                    method: "POST",
                    headers: {
                        'Accept': 'image/png',
                        'Authorization': 'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({inputs: input})
                }
            );

            const blob = await response.blob();
            const imageURL = URL.createObjectURL(blob);
            const updatedComicRows = [...comicRows];
            updatedComicRows[rowIndex] = { text: input, imageURL: imageURL };
            setComicRows(updatedComicRows);
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    }, 1000),[]);




    const handleChange = (values, rowIndex) => {
        const updatedComicRows = [...comicRows];
        updatedComicRows[rowIndex] = { text: values, imageURL: updatedComicRows[rowIndex].imageURL, imageLoading: true };
        setComicRows(updatedComicRows);
        debouncedApiRequest(values, rowIndex);
    };




    return (
        <div>
            {comicRows.map((row, index) => (
                <>
                <Row gutter={5}></Row>
                <Row key={index} gutter={16} style={{ marginBottom: '20px' }}>
                    <Col xs={24} sm={6} md={12} lg={8} xl={1}></Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                        <Form
                            name={`comicForm${index}`}
                            autoComplete="off"
                            initialValues={{ text: row.text, imageUrl: row.imageUrl }}
                        >

                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item name="text" label={`Comic Panel ${index + 1}`}>
                                        <Input onChange={(values) => {
                                            handleChange(values.target.value, index)}
                                        } rows={5} on placeholder="Enter text for the comic panel." />
                                    </Form.Item>
                                </Col>
                            </Row>

                        </Form>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                        <Card title={`Panel ${index + 1}`} style={{ marginBottom: '16px' }}>
                            <p>{row.text}</p>
                            {row.imageLoading ? (
                                <Spin size="large" />
                            ) : (
                                row.imageURL && <Image src={row.imageURL} alt={`Panel ${index + 1}`} />
                            )}
                        </Card>
                    </Col>
                </Row>
                </>
            ))}
        </div>
    );
};

export default ComicGeneratorWithApiImages;