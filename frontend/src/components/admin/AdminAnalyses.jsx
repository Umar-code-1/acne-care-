// src/components/admin/AdminAnalyses.jsx
import React from "react";
import AppIcon from "../shared/AppIcon";
import Disclaimer from "../shared/Disclaimer";
import ScanImage from "../shared/ScanImage";


function AdminAnalyses({ analyses = [] }) {
  return (
    <div>
      <div className="ph">
        <div className="pt">All Skin Analyses</div>
        <div className="ps">
          AI-generated acne type and severity assessments across all patients
        </div>
        <Disclaimer variant="ai" />
      </div>

      <div className="card">
        <div className="card-h">
          <div className="card-t">Analysis Records</div>
          <div className="ps">{analyses.length} total</div>
        </div>
        <div className="card-b">
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Patient</th>
                  <th>Acne Type</th>
                  <th>Severity</th>
                  <th>Skin Type</th>
                  <th>Confidence</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((a) => (
                  <tr key={a._id || a.id}>
                    <td>
                      <ScanImage
                        scanId={a._id || a.id}
                        alt={`${a.pname || "Patient"} scan`}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          objectFit: "cover",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "var(--bg)",
                          fontSize: "0.7rem",
                          color: "var(--text3)",
                        }}
                      />
                    </td>

                    <td style={{ fontWeight: 600 }}>{a.pname || "Unknown"}</td>

                    <td>{a.atype || "—"}</td>

                    <td>
                      <span className={`badge b-${(a.sev || "clear").toLowerCase()}`}>
                        {a.sev || "Clear"}
                      </span>
                    </td>

                    <td>{a.skinType || "NA"}</td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            height: 5,
                            background: "var(--border)",
                            borderRadius: 3,
                            overflow: "hidden",
                            minWidth: 50,
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${a.conf || 0}%`,
                              background: "var(--pri)",
                              borderRadius: 3,
                            }}
                          />
                        </div>
                        <strong>{a.conf || 0}%</strong>
                      </div>
                    </td>

                    <td>{a.date || "—"}</td>
                  </tr>
                ))}

                {analyses.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty" style={{ padding: "1.5rem" }}>
                        <div className="empty-ic"><AppIcon name="search" /></div>
                        <div className="empty-t">No analyses in system</div>
                        <div className="empty-s">
                          Once patients upload photos, AI analyses will appear
                          here.
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalyses;
