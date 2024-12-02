import React, { useEffect, useState } from 'react';
import axios from 'axios';


export default function Profile() {
    const [profile, setProfile] = useState({ email: '', username: '', name: '' });
    const [editable, setEditable] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('로그인이 필요합니다.');
                    return;
                }
                console.log("프로필 전");
                console.log(token);
                const response = await axios.get('http://localhost:8080/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        //'Content-Type': 'application/json'
                    },
                });
                console.log("프로필 후");
                console.log(response.headers);
                if (response.data) {
                    console.log(response.data + "받아옴");
                    setProfile(response.data);
                }
                console.log(profile.email + profile.username + profile.name);
            } catch (err) {
                console.error('프로필 정보를 가져오는 중 오류:', err);
                if (err.response?.status === 401) {
                    setError('로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.');
                } else {
                    setError('프로필 정보를 가져올 수 없습니다.');
                }
            }
        };

        fetchProfile();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('로그인이 필요합니다.');
                return;
            }

            await axios.put(
                'http://localhost:8080/api/profile/update',
                {
                    username: profile.username,
                    name: profile.name,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            alert('프로필 정보가 성공적으로 수정되었습니다.');
            setEditable(false);
        } catch (err) {
            console.error('프로필 정보를 수정하는 중 오류:', err);
            setError('프로필 정보를 수정할 수 없습니다.');
        }
    };

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="profile-container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>프로필</h1>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <strong>이메일:</strong>
                </label>
                <input
                    type="text"
                    value={profile.email}
                    readOnly
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#f0f0f0' }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <strong>사용자 이름:</strong>
                </label>
                <input
                    type="text"
                    value={profile.username}
                    readOnly={!editable}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        backgroundColor: editable ? '#fff' : '#f0f0f0',
                    }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <strong>이름:</strong>
                </label>
                <input
                    type="text"
                    value={profile.name}
                    readOnly={!editable}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        backgroundColor: editable ? '#fff' : '#f0f0f0',
                    }}
                />
            </div>
            <div style={{ textAlign: 'center' }}>
                {editable ? (
                    <>
                        <button
                            onClick={handleUpdateProfile}
                            style={{
                                padding: '10px 20px',
                                margin: '5px',
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            저장
                        </button>
                        <button
                            onClick={() => setEditable(false)}
                            style={{
                                padding: '10px 20px',
                                margin: '5px',
                                backgroundColor: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            취소
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setEditable(true)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#008CBA',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        수정
                    </button>
                )}
            </div>
        </div>
    );
}
