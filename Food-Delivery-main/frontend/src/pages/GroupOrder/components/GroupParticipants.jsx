import React from 'react';

const GroupParticipants = ({ members, adminId }) => {
    return (
        <div className="group-participants-section">
            <h3 className="section-title">👥 Active Participants ({members?.length || 0})</h3>
            <div className="participants-list-modern">
                {members?.map((member) => (
                    <div key={member.userId} className={`participant-card-item ${member.userId === adminId ? 'admin' : ''}`}>
                        <div className="participant-avatar">
                            {member?.name ? member.name[0].toUpperCase() : "?"}
                        </div>
                        <div className="participant-info">
                            <span className="participant-name">{member.name}</span>
                            <span className="participant-role">
                                {member.userId === adminId ? '✨ Group Host' : 'Hungry Friend'}
                            </span>
                        </div>
                        {member.userId === adminId && <div className="admin-crown">👑</div>}
                    </div>
                ))}
            </div>
            
            <style jsx>{`
                .participants-list-modern {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    max-height: 250px;
                    overflow-y: auto;
                    padding-right: 5px;
                }
                .participant-card-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: #f8fafc;
                    border-radius: 14px;
                    border: 1px solid #e2e8f0;
                    transition: transform 0.2s;
                }
                .participant-card-item:hover {
                    transform: translateX(5px);
                    background: #fff;
                }
                .participant-card-item.admin {
                    background: #fff7ed;
                    border-color: #ffedd5;
                }
                .participant-avatar {
                    width: 36px;
                    height: 36px;
                    background: #6366f1;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    font-weight: 800;
                    font-size: 14px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .admin .participant-avatar {
                    background: #f97316;
                }
                .participant-info {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                .participant-name {
                    font-weight: 700;
                    font-size: 0.95rem;
                    color: #1e293b;
                }
                .participant-role {
                    font-size: 0.7rem;
                    color: #64748b;
                }
                .admin-crown {
                    font-size: 1.2rem;
                }
            `}</style>
        </div>
    );
};

export default GroupParticipants;
