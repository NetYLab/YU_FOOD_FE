import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QnADetail = () => {
    const { id } = useParams(); // 질문 ID
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [newAnswer, setNewAnswer] = useState('');
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const isAdmin = role === 'ROLE_ADMIN';

    // 질문과 답변 데이터를 가져오는 함수
    const fetchQuestionAndAnswers = async () => {
        try {
            const token = localStorage.getItem('token');
    
            const questionResponse = await axios.get(`http://localhost:8080/api/questions/${id}`,{
                 headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }});
            setQuestion(questionResponse.data);
            const answerResponse = await axios.get(`http://localhost:8080/api/answers/${id}`, {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }});
            setAnswers(answerResponse.data);
        } catch (error) {
            console.error('데이터를 가져오는 중 오류 발생:', error);
        }
    };

    // 컴포넌트 로드 시 데이터 가져오기
    useEffect(() => {
        fetchQuestionAndAnswers();
    }, [id]);

    // 답변 작성 핸들러
    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:8080/api/answers',
                {
                    questionId: id,
                    content: newAnswer,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNewAnswer('');
            fetchQuestionAndAnswers(); // 답변 목록 새로고침
        } catch (error) {
            console.error('답변 등록 실패:', error);
            alert('답변 등록에 실패했습니다.');
        }
    };

    // 질문 삭제 핸들러
    const handleDeleteQuestion = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/questions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('질문이 삭제되었습니다.');
            navigate('/QnABoard'); // 삭제 후 목록 페이지로 이동
        } catch (error) {
            console.error('질문 삭제 실패:', error);
            alert('질문 삭제에 실패했습니다.');
        }
    };

    // 답변 삭제 핸들러
    const handleDeleteAnswer = async (answerId) => {
        try {
            await axios.delete(`http://localhost:8080/api/answers/${answerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('답변이 삭제되었습니다.');
            fetchQuestionAndAnswers(); // 답변 목록 새로고침
        } catch (error) {
            console.error('답변 삭제 실패:', error);
            alert('답변 삭제에 실패했습니다.');
        }
    };

    if (!question) return <div>로딩 중...</div>;

    return (
        <div>
            <h2>{question.title}</h2>
            <p>{question.content}</p>
            <p>작성자: {question.username}</p>

            {/* 관리자 또는 작성자만 수정 및 삭제 가능 */}
            {(question.isOwner || isAdmin) && (
                <div>
                    <button onClick={() => navigate(`/QnABoard/edit/${id}`)}>수정</button>
                    <button onClick={handleDeleteQuestion}>삭제</button>
                </div>
            )}

            <hr />
            <h3>답변 목록</h3>
            {answers.map((answer) => (
                <div key={answer.id}>
                    <p>{answer.content}</p>
                    <p>작성자: {answer.username}</p>

                    {/* 관리자 또는 답변 작성자만 삭제 가능 */}
                    {(answer.isOwner || isAdmin) && (
                        <button onClick={() => handleDeleteAnswer(answer.id)}>삭제</button>
                    )}
                </div>
            ))}

            <hr />
            <form onSubmit={handleAnswerSubmit}>
                <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    placeholder="답변을 입력하세요"
                    required
                />
                <button type="submit">답변 작성</button>
            </form>
        </div>
    );
};

export default QnADetail;
