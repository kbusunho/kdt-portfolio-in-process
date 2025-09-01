import React ,{useState,useEffect}from 'react'
import "./styles/AdminContact.scss"
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../lib/api"; // baseURL + withCredentials: true
const AdminContact = () => {

  const [contacts,setContacts]=useState([])

  useEffect(()=>{

    const fetchData =async()=>{
      try {
        const res = await api.get('/api/contact')

        setContacts(res.data)

      } catch (error) {
        console.log("문의글 불러오기 실패",error)
      }
    }

    fetchData()
  },[])


  // 2) 상태 업데이트
  const handleStatusUpdate = async (contactId, newStatus) => {
    try {
      await api.put(
        `/api/contact/${contactId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      // 로컬 상태 동기화
      setContacts((prev) =>
        prev.map((c) => (c._id === contactId ? { ...c, status: newStatus } : c))
      );

      Swal.fire("수정완료", "상태가 성공적으로 수정되었습니다.", "success");
    } catch (error) {
      console.log("수정 실패:", error);
      Swal.fire("오류발생", "수정 중 문제가 발생했습니다.", "error");
    }
  };

  
  // 3) 상태 변경 모달
  const showStatusChangeModal = async (contact) => {
    const { value: newStatus, isConfirmed } = await Swal.fire({
      title: "문의 상태 수정",
      input: "radio",
      inputOptions: {
        pending: "대기중",
        "in progress": "진행중",
        completed: "완료",
      },
      inputValue: contact.status,
      confirmButtonText: "적용하기",
      cancelButtonText: "취소",
      showCancelButton: true,
    });

    if (isConfirmed && newStatus) {
      handleStatusUpdate(contact._id, newStatus);
    }
  };

    // 4) 삭제
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "삭제하시겠습니까?",
      text: "이 작업은 되돌릴 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/api/contact/${id}`, { withCredentials: true });
      setContacts((prev) => prev.filter((c) => c._id !== id));
      Swal.fire("삭제완료!", "문의가 성공적으로 삭제되었습니다.", "success");
    } catch (error) {
      console.log("삭제 실패:", error);
      Swal.fire("오류발생", "삭제 중 문제가 발생했습니다.", "error");
    }
  };
  return (
<div className="inner admin-contact-inner">
      <h2>📩 문의글 관리</h2>
    <div className="contact-wrapper">


      {contacts.length === 0 ? (
        <p>문의 내역이 없습니다.</p>
      ) : (
        <ul className="contact-list">
          {contacts.map((c) => (
            <li key={c._id} className="contact-item">
              <h3>{c.name} ({c.email})</h3>
              <p><strong>전화번호:</strong> {c.phone}</p>
              <p><strong>메시지:</strong> {c.message}</p>
                   <p className={`status status--${(c.status || "").replace(" ", "-")}`}>
                  <strong>상태:</strong> {c.status}
                </p>
                
                <div className="btns">
                  <button onClick={() => showStatusChangeModal(c)}>상태 변경</button>
                  <button className="danger" onClick={() => handleDelete(c._id)}>
                    삭제
                  </button>
                </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>

  )
}

export default AdminContact