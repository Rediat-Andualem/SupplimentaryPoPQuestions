// import React, { useEffect, useState } from 'react';
// import styles from './ReusableForm.module.css';
// import { axiosInstance } from '../../utility/axiosInstance';
// import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
// const ReusableForm = ({ title, placeholder, fetchUrl, createUrl, deleteUrlBase }) => {
//   const [inputValue, setInputValue] = useState('');
//   const [phase, setPhase] = useState([]);
//   const [week, setWeek] = useState([]);
//   const [course, setCourse] = useState([]);
//   const [itemToDelete, setItemToDelete] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [errorMsg, setErrorMsg] = useState('');

//   const authHeader = useAuthHeader();

//   // ✅ Fetch items
// useEffect(() => {
//   const fetchItems = async () => {
//     try {
    
//       const res = await axiosInstance.get(fetchUrl,
//         {
//           headers: {
//             Authorization: authHeader,
//           },
//         }
//       );
//       console.log(res)
//       // Defensive check
//       const data = Array.isArray(res.data) ? res.data : res.data.data || [];
//       setPhase(res.data.phases)
//       setWeek(res.data.weeks)
//       setCourse(res.data.courses)
//     } catch (error) {
//       console.error(`[${title}] Error:`, error);
//       setErrorMsg(`Error loading ${title.toLowerCase()}.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchItems();
// }, [fetchUrl, title]);


//   // ✅ Create item
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const trimmed = inputValue.trim();
//     if (!trimmed) return;

//     try {
//       const res = await axiosInstance.post(createUrl, { name: trimmed });
//       setItems([...items, res.data]);
//       setInputValue('');
//       setErrorMsg('');
//     } catch (error) {
//       console.error(error);
//       setErrorMsg(`Could not create ${title.toLowerCase()}.`);
//     }
//   };

//   // ✅ Delete item
//   const confirmDelete = async () => {
//     try {
//       await axiosInstance.delete(`${deleteUrlBase}/${itemToDelete.id}`);
//       setItems(items.filter((item) => item.id !== itemToDelete.id));
//       setErrorMsg('');
//     } catch (error) {
//       console.error(error);
//       setErrorMsg(`Could not delete ${title.toLowerCase()}.`);
//     } finally {
//       setItemToDelete(null);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <form onSubmit={handleSubmit} className={styles.form}>
//         <h3 className={styles.title}>{title}</h3>
//         <div className={styles.inputGroup}>
//           <input
//             type="text"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             placeholder={placeholder || 'Enter value'}
//             className={styles.input}
//           />
//           <button type="submit" className={styles.button}>Create</button>
//         </div>
//         {errorMsg && <p className={styles.error}>{errorMsg}</p>}
//       </form>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <ul className={styles.list}>
//           {items?.map((item) => (
//             <li key={item.id} className={styles.listItem}>
//               <span>{item.name}</span>
//               <button
//                 className={styles.deleteButton}
//                 onClick={() => setItemToDelete(item)}
//               >
//                 Delete
//               </button>
//             </li>
//           ))}
//         </ul>
//       )}

//       {itemToDelete && (
//         <div className={styles.modalBackdrop}>
//           <div className={styles.modal}>
//             <p>
//               Are you sure you want to delete "<strong>{itemToDelete.name}</strong>"?
//             </p>
//             <div className={styles.modalButtons}>
//               <button className={styles.cancelBtn} onClick={() => setItemToDelete(null)}>Cancel</button>
//               <button className={styles.confirmBtn} onClick={confirmDelete}>Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReusableForm;
import React, { useEffect, useState } from 'react';
import styles from './ReusableForm.module.css';
import { axiosInstance } from '../../utility/axiosInstance';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

const ReusableForm = ({ title, placeholder, fetchUrl, createUrl, deleteUrlBase,  nameKey }) => {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const authHeader = useAuthHeader();

  // ✅ Fetch items based on props
  useEffect(() => {
    fetchItems();
  }, [fetchUrl, title, authHeader]);


  const fetchItems = async () => {
  try {
    const res = await axiosInstance.get(fetchUrl, {
      headers: {
        Authorization: authHeader,
      },
    });

    let rawItems = res.data;
    if (!Array.isArray(rawItems)) {
      const firstArray = Object.values(rawItems).find((val) => Array.isArray(val));
      rawItems = firstArray || [];
    }

    // 🔧 Normalize: Map to { id, name } regardless of original field
    const normalizedItems = rawItems.map(
      
      (item) => (
        {
      
      id: item.WeekId || item.phaseId || item.courseId || item.name,
      name: item.courseName || item.phaseName || item.WeekName,
    }
  
  
  )

);

    setItems(normalizedItems);
    setErrorMsg('');
  } catch (error) {
    console.error(`[${title}] Error fetching:`, error);
    setErrorMsg(`Error loading ${title.toLowerCase()}.`);
  } finally {
    setLoading(false);
  }
};


  // ✅ Create item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    try {
      const res = await axiosInstance.post(
        createUrl,
        { [  nameKey]: trimmed },
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      setItems([...items, res.data]);
      setInputValue('');
      setErrorMsg('');
      fetchItems()
    } catch (error) {
      console.error(`[${title}] Error creating:`, error);
      setErrorMsg(`Could not create ${title.toLowerCase()}.`);
    }
  };

  // ✅ Delete item
  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`${deleteUrlBase}${itemToDelete.id}`, {
        headers: {
          Authorization: authHeader,
        },
      });

      setItems(items.filter((item) => item.id !== itemToDelete.id));
      setErrorMsg('');
    } catch (error) {
      console.error(`[${title}] Error deleting:`, error);
      setErrorMsg(`Could not delete ${title.toLowerCase()}.`);
    } finally {
      setItemToDelete(null);
    }
  };
  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder || 'Enter value'}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Create</button>
        </div>
        {errorMsg && <p className={styles.error}>{errorMsg}</p>}
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className={styles.list}>
          {items?.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <span>{item.name}</span>
              <button
                className={styles.deleteButton}
                onClick={() => setItemToDelete(item)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {itemToDelete && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <p>
              Are you sure you want to delete "<strong>{itemToDelete.name}</strong>"?
            </p>
            <div className={styles.modalButtons}>
              <button className={styles.cancelBtn} onClick={() => setItemToDelete(null)}>Cancel</button>
              <button className={styles.confirmBtn} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReusableForm;
