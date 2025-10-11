import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showErrorDialog, showSuccessDialog } from '../../../helpers/toolsHelper';
import { 
    asyncPutProfile, 
    asyncPostProfilePhoto,
    setIsChangeProfileActionCreator,
    setIsChangeProfilePhotoActionCreator,
    asyncSetProfile // Untuk refresh data profil setelah update
} from "../../users/states/action"; 

function ProfilePage() {
    const dispatch = useDispatch();
    const profile = useSelector((state) => state.profile);
    const isChangeProfile = useSelector((state) => state.isChangeProfile);
    const isChangeProfilePhoto = useSelector((state) => state.isChangeProfilePhoto);

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    // State untuk mengelola file foto yang dipilih
    const [selectedPhoto, setSelectedPhoto] = useState(null); 
    const fileInputRef = useRef(null); // Ref untuk input file

    // 1. Sinkronisasi data Redux ke state lokal
    useEffect(() => {
        if (profile) {
            setName(profile.name || '');
            setEmail(profile.email || '');
        }
    }, [profile]);
    
    // 2. Logika setelah pembaruan DATA DIRI selesai
    useEffect(() => {
        if (isChangeProfile) {
            setLoading(false);
            dispatch(setIsChangeProfileActionCreator(false));
            showSuccessDialog('Data diri berhasil diperbarui!');
            dispatch(asyncSetProfile()); // Refresh data profil
        }
    }, [isChangeProfile, dispatch]);

    // 3. Logika setelah pembaruan FOTO PROFIL selesai
    useEffect(() => {
        if (isChangeProfilePhoto) {
            setLoading(false);
            dispatch(setIsChangeProfilePhotoActionCreator(false));
            showSuccessDialog('Foto profil berhasil diperbarui!');
            setSelectedPhoto(null); // Reset preview
            dispatch(asyncSetProfile()); // Refresh data profil
        }
    }, [isChangeProfilePhoto, dispatch]);

    // Handler Simpan Data Diri (Nama & Email)
    function handleSaveProfile() {
        if (!name || !email) {
            showErrorDialog('Nama dan Email tidak boleh kosong.');
            return;
        }

        setLoading(true);
        // Menggunakan action yang sudah ada: asyncPutProfile
        dispatch(asyncPutProfile(name, email)); 
    }
    
    // Handler Ubah Foto Profil
    function handleSavePhoto() {
        if (!selectedPhoto) {
            showErrorDialog('Pilih file foto terlebih dahulu.');
            return;
        }
        
        setLoading(true);
        // Menggunakan action untuk mengunggah foto
        dispatch(asyncPostProfilePhoto(selectedPhoto));
    }
    
    // Handler untuk input file
    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            // Check file size (Misalnya, maksimal 5MB)
            const MAX_FILE_SIZE = 5 * 1024 * 1024; 
            if (file.size > MAX_FILE_SIZE) {
                showErrorDialog("Ukuran file terlalu besar. Maksimal 5MB");
                // Reset input file
                if (fileInputRef.current) fileInputRef.current.value = "";
                setSelectedPhoto(null);
                return;
            }
            setSelectedPhoto(file);
        }
    }


    if (!profile) {
        return (
            <div className="main-content">
                <div className="container-fluid mt-3">
                    <p>Memuat data profil...</p>
                </div>
            </div>
        );
    }
    
    // Tentukan URL foto profil saat ini atau foto preview
    const profilePhotoUrl = selectedPhoto 
        ? URL.createObjectURL(selectedPhoto) 
        : (profile.photo || '/default-user.png'); // Asumsikan '/default-user.png' adalah default

    return (
        <div className="main-content">
            <div className="container-fluid mt-3">
                <h2>Ubah Data Profil</h2>
                <hr />

                <div className="row">
                    {/* KOLOM KIRI: Foto Profil */}
                    <div className="col-md-4">
                        <div className="card shadow-sm mb-4">
                            <div className="card-body text-center">
                                <h5 className="card-title mb-3">Foto Profil</h5>
                                <img
                                    src={profilePhotoUrl}
                                    alt="Foto Profil"
                                    className="rounded-circle mb-3"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover', border: '3px solid #0d6efd' }}
                                />
                                
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    className="form-control mb-3"
                                    disabled={loading}
                                />
                                
                                {selectedPhoto && (
                                    <button
                                        type="button"
                                        className="btn btn-warning w-100"
                                        onClick={handleSavePhoto}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                        ) : (
                                            <i className="bi bi-upload me-2"></i>
                                        )}
                                        Unggah Foto
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: Data Diri */}
                    <div className="col-md-8">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title mb-3">Informasi Akun</h5>
                                
                                <div className="mb-3">
                                    <label htmlFor="profileName" className="form-label">Nama</label>
                                    <input
                                        id="profileName"
                                        type="text"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="profileEmail" className="form-label">Email</label>
                                    <input
                                        id="profileEmail"
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                
                                <div className="d-flex justify-content-end mt-4">
                                    {loading ? (
                                        <button type="button" className="btn btn-primary" disabled>
                                            <span className="spinner-border spinner-border-sm"></span>
                                            &nbsp;Menyimpan...
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleSaveProfile}
                                        >
                                            <i className="bi bi-save me-2"></i> Simpan Data Diri
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;