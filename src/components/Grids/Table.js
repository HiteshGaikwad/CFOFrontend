// {/* <table
//                             id="tableMaturity"
//                             className="table table-bordered table-hover table-striped w-100"
//                           >
//                             <thead
//                               className="bg-highlight"
//                               style={{ fontSize: "12px" }}
//                             >
//                               <tr>
//                                 <th
//                                   // className="text-right"
//                                   style={{ width: "50px" }}
//                                 >
//                                   No.
//                                 </th>
//                                 <th>User Name</th>
//                                 <th style={{ minWidth: "70px" }}>User Type</th>
//                                 <th style={{ minWidth: "120px" }}>
//                                   Employee Status
//                                 </th>
//                                 <th>Mobile</th>
//                                 <th>Email</th>
//                                 <th>Status</th>
//                                 <th style={{ textAlign: "center" }}>Actions</th>
//                               </tr>
//                             </thead>
//                             <tbody
//                               id="tableMaturityData"
//                               style={{
//                                 fontSize: "11px",
//                                 height: "5px",
//                                 textAlign: "start",
//                               }}
//                             >
//                               {userInfo && userInfo.length > 0 ? (
//                                 userInfo.map((user, index) => {
//                                   return (
//                                     <tr
//                                       key={user.User_Id}
//                                       style={{ height: "5px" }}
//                                     >
//                                       <td
//                                         // className="text-right"
//                                         style={{
//                                           width: "60px",
//                                         }}
//                                       >
//                                         {index + 1}
//                                       </td>
//                                       <td>{user.User_Name}</td>
//                                       <td>{user.UserType_Name}</td>
//                                       <td>
//                                         {user.Is_Employee === 1 ? "Yes" : "No"}
//                                       </td>
//                                       <td>{user.Mobile}</td>
//                                       <td>{user.Email}</td>
//                                       <td>
//                                         {user.Is_Active === 1
//                                           ? "Active"
//                                           : "In-active"}
//                                       </td>
//                                       <td
//                                         className="text-right"
//                                         style={{
//                                           width: "150px",
//                                           padding: "5px",
//                                         }}
//                                       >
//                                         <button
//                                           style={{
//                                             border: "none",
//                                             height: "36px",
//                                             backgroundColor: "transparent",
//                                             width: "36px",
//                                             borderRadius: "18px",
//                                             marginRight: "10px",
//                                           }}
//                                           onClick={() => {
//                                             handleEditUser(user);
//                                             setAddUser(true);
//                                             setIsEdit(true);
//                                           }}
//                                         >
//                                           <FaRegEdit
//                                             style={{
//                                               color: "#EB6400",
//                                               fontSize: "18px",
//                                             }}
//                                           />
//                                         </button>
//                                         <DeleteButton
//                                           onDelete={() =>
//                                             handleDeleteUser(user)
//                                           }
//                                         />
//                                       </td>
//                                     </tr>
//                                   );
//                                 })
//                               ) : (
//                                 <tr>
//                                   <td
//                                     colSpan={8}
//                                     className="text-center"
//                                     style={{ fontSize: "16px" }}
//                                   >
//                                     {tableMessage}
//                                   </td>
//                                 </tr>
//                               )}
//                             </tbody>
//                           </table> */}
